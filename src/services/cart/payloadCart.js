"use server";
/**
 * Payload CMS Cart Service
 * Handles cart operations with the Payload CMS backend (bps-core)
 */

import { PayloadSDK } from "@payloadcms/sdk";
import { logError } from "@/utils";

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL;
const CORE_API_KEY = process.env.CORE_API_KEY;
const CORE_TENANT_ID = process.env.CORE_TENANT_ID || process.env.CORE_TENTANT_ID;

const ensureCoreTenantId = () => {
  if (!CORE_TENANT_ID) {
    throw new Error("Missing CORE_TENANT_ID environment variable");
  }
};

const resolveAbsoluteMediaUrl = (source) => {
  if (!source) return "";
  if (/^(https?:)?\/\//.test(source) || source.startsWith("wix:")) return source;

  if (source.startsWith("/")) {
    return `${(CORE_API_BASE_URL || "").replace(/\/$/, "")}${source}`;
  }

  return source;
};

const resolveLineItemImage = (item) => {
  const product = typeof item?.product === "object" ? item.product : null;
  const firstMediaItem = Array.isArray(product?.mediaItems) ? product.mediaItems[0] : null;

  return resolveAbsoluteMediaUrl(
    item?.image ||
      item?.mediaItem?.src ||
      product?.mainMedia?.url ||
      product?.mainMedia ||
      product?.featuredImage?.url ||
      product?.featuredImage?.sizes?.thumbnail?.url ||
      firstMediaItem?.url ||
      firstMediaItem?.src ||
      firstMediaItem?.media?.url ||
      product?.media?.url ||
      "",
  );
};

const hydrateCartForClient = (cart) => {
  if (!cart || !Array.isArray(cart.lineItems)) return cart;

  return {
    ...cart,
    lineItems: cart.lineItems.map((item) => {
      const product = typeof item?.product === "object" ? item.product : null;
      return {
        ...item,
        _id: item?._id || item?.id,
        id: item?.id || item?._id,
        name: item?.name || product?.name || product?.title || "",
        image: resolveLineItemImage(item),
      };
    }),
  };
};

const buildMemberCartWhere = (memberId) => ({
  and: [
    { member: { equals: memberId } },
    { tenant: { equals: CORE_TENANT_ID } },
  ],
});

const buildVisitorCartWhere = (visitorId) => ({
  and: [
    { visitorId: { equals: visitorId } },
    { tenant: { equals: CORE_TENANT_ID } },
  ],
});

// Initialize Payload SDK with API key auth for server-side operations
const getSDK = (token = null) => {
  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : { Authorization: `Bearer ${CORE_API_KEY}` };

  return new PayloadSDK({
    baseURL: `${CORE_API_BASE_URL}/api`,
    baseInit: { headers },
  });
};

/**
 * Get or create cart for a member
 * @param {string} memberId - The member's ID
 * @param {string} token - The member's auth token
 * @returns {Promise<object>} The cart document
 */
export const getOrCreateCart = async (memberId, token) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    // Try to find existing cart for this member and tenant
    const existingCarts = await sdk.find({
      collection: "cart",
      where: buildMemberCartWhere(memberId),
      limit: 1,
      depth: 2, // Include product and variant details
    });

    if (existingCarts.docs?.length > 0) {
      return hydrateCartForClient(existingCarts.docs[0]);
    }

    // Create new cart for member
    const newCart = await sdk.create({
      collection: "cart",
      data: {
        member: memberId,
        tenant: CORE_TENANT_ID,
        lineItems: [],
        status: "active",
      },
    });

    return hydrateCartForClient(newCart);
  } catch (error) {
    logError("Error getting/creating cart:", error);
    throw new Error(error.message || "Failed to get or create cart");
  }
};

/**
 * Get cart for a member
 * @param {string} memberId - The member's ID
 * @param {string} token - The member's auth token
 * @returns {Promise<object|null>} The cart document or null
 */
export const getMemberCart = async (memberId, token) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    const result = await sdk.find({
      collection: "cart",
      where: buildMemberCartWhere(memberId),
      limit: 1,
      depth: 2,
    });

    return hydrateCartForClient(result.docs?.[0] || null);
  } catch (error) {
    logError("Error getting cart:", error);
    throw new Error(error.message || "Failed to get cart");
  }
};

/**
 * Transform frontend line item format to Payload format
 * @param {object} item - Frontend line item (Wix-compatible format)
 * @returns {object} Payload cart line item
 */
const transformLineItem = (item) => {
  const { catalogReference, quantity } = item;

  // Extract product ID from catalogReference
  const productId = catalogReference?.catalogItemId;
  const options = catalogReference?.options || {};

  // Build customTextFieldValues from options.customTextFields
  const customTextFieldValues = [];
  if (options.customTextFields) {
    Object.entries(options.customTextFields).forEach(([title, value]) => {
      customTextFieldValues.push({ title, value: String(value) });
    });
  }

  // Build selectedOptions from options.options (if any)
  const selectedOptions = options.options || null;

  return {
    product: productId,
    variant: options.variantId || null,
    quantity: quantity || 1,
    selectedOptions,
    customTextFieldValues,
    addedAt: new Date().toISOString(),
  };
};

/**
 * Add items to cart
 * @param {string} memberId - The member's ID
 * @param {string} token - The member's auth token
 * @param {Array} lineItems - Array of line items to add (Wix-compatible format)
 * @returns {Promise<object>} Updated cart
 */
export const addToCart = async (memberId, token, lineItems) => {
  try {
    const cart = await getOrCreateCart(memberId, token);
    const sdk = getSDK(token);

    // Transform incoming line items to Payload format
    const newItems = lineItems.map(transformLineItem);

    // Merge with existing items (check for duplicates)
    const existingItems = cart.lineItems || [];
    const mergedItems = [...existingItems];

    for (const newItem of newItems) {
      // Check if product already exists in cart
      const existingIndex = mergedItems.findIndex((item) => {
        const existingProductId =
          typeof item.product === "object" ? item.product.id : item.product;
        const existingVariantId =
          typeof item.variant === "object" ? item.variant?.id : item.variant;

        return (
          existingProductId === newItem.product &&
          existingVariantId === newItem.variant &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(newItem.selectedOptions) &&
          JSON.stringify(item.customTextFieldValues) ===
            JSON.stringify(newItem.customTextFieldValues)
        );
      });

      if (existingIndex >= 0) {
        // Update quantity of existing item
        mergedItems[existingIndex] = {
          ...mergedItems[existingIndex],
          product:
            typeof mergedItems[existingIndex].product === "object"
              ? mergedItems[existingIndex].product.id
              : mergedItems[existingIndex].product,
          variant:
            typeof mergedItems[existingIndex].variant === "object"
              ? mergedItems[existingIndex].variant?.id
              : mergedItems[existingIndex].variant,
          quantity: mergedItems[existingIndex].quantity + newItem.quantity,
        };
      } else {
        // Add new item
        mergedItems.push(newItem);
      }
    }

    // Normalize all items to use IDs instead of objects
    const normalizedItems = mergedItems.map((item) => ({
      product: typeof item.product === "object" ? item.product.id : item.product,
      variant:
        typeof item.variant === "object" ? item.variant?.id : item.variant,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
      customTextFieldValues: item.customTextFieldValues,
      notes: item.notes,
      addedAt: item.addedAt,
    }));

    // Update cart with merged items
    await sdk.update({
      collection: "cart",
      where: buildMemberCartWhere(memberId),
      limit: 1,
      data: {
        lineItems: normalizedItems,
      },
    });

    return await getMemberCart(memberId, token);
  } catch (error) {
    logError("Error adding to cart:", error);
    throw new Error(error.message || "Failed to add to cart");
  }
};

/**
 * Update line item quantity
 * @param {string} memberId - The member's ID
 * @param {string} token - The member's auth token
 * @param {Array} updates - Array of { id, quantity } updates
 * @returns {Promise<object>} Updated cart
 */
export const updateCartQuantity = async (memberId, token, updates) => {
  try {
    const cart = await getMemberCart(memberId, token);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const sdk = getSDK(token);
    const existingItems = cart.lineItems || [];

    // Update quantities based on line item index or product match
    const updatedItems = existingItems.map((item, index) => {
      const update = updates.find((u) => {
        // Match by _id if provided, otherwise by product ID
        if (u._id) return item.id === u._id;
        if (u.id) return item.id === u.id;
        return false;
      });

      if (update) {
        return {
          product:
            typeof item.product === "object" ? item.product.id : item.product,
          variant:
            typeof item.variant === "object" ? item.variant?.id : item.variant,
          quantity: update.quantity,
          selectedOptions: item.selectedOptions,
          customTextFieldValues: item.customTextFieldValues,
          notes: item.notes,
          addedAt: item.addedAt,
        };
      }

      return {
        product:
          typeof item.product === "object" ? item.product.id : item.product,
        variant:
          typeof item.variant === "object" ? item.variant?.id : item.variant,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
        customTextFieldValues: item.customTextFieldValues,
        notes: item.notes,
        addedAt: item.addedAt,
      };
    });

    await sdk.update({
      collection: "cart",
      where: buildMemberCartWhere(memberId),
      limit: 1,
      data: {
        lineItems: updatedItems,
      },
    });

    return await getMemberCart(memberId, token);
  } catch (error) {
    logError("Error updating cart quantity:", error);
    throw new Error(error.message || "Failed to update cart quantity");
  }
};

/**
 * Remove items from cart
 * @param {string} memberId - The member's ID
 * @param {string} token - The member's auth token
 * @param {Array<string>} lineItemIds - Array of line item IDs to remove
 * @returns {Promise<object>} Updated cart
 */
export const removeFromCart = async (memberId, token, lineItemIds) => {
  try {
    const cart = await getMemberCart(memberId, token);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const sdk = getSDK(token);
    const existingItems = cart.lineItems || [];

    // Filter out removed items
    const remainingItems = existingItems
      .filter((item) => !lineItemIds.includes(item.id))
      .map((item) => ({
        product:
          typeof item.product === "object" ? item.product.id : item.product,
        variant:
          typeof item.variant === "object" ? item.variant?.id : item.variant,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
        customTextFieldValues: item.customTextFieldValues,
        notes: item.notes,
        addedAt: item.addedAt,
      }));

    await sdk.update({
      collection: "cart",
      where: buildMemberCartWhere(memberId),
      limit: 1,
      data: {
        lineItems: remainingItems,
      },
    });

    return await getMemberCart(memberId, token);
  } catch (error) {
    logError("Error removing from cart:", error);
    throw new Error(error.message || "Failed to remove from cart");
  }
};

/**
 * Clear cart
 * @param {string} memberId - The member's ID
 * @param {string} token - The member's auth token
 * @returns {Promise<object>} Empty cart
 */
export const clearCart = async (memberId, token) => {
  try {
    const cart = await getMemberCart(memberId, token);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const sdk = getSDK(token);

    await sdk.update({
      collection: "cart",
      where: buildMemberCartWhere(memberId),
      limit: 1,
      data: {
        lineItems: [],
      },
    });

    return await getMemberCart(memberId, token);
  } catch (error) {
    logError("Error clearing cart:", error);
    throw new Error(error.message || "Failed to clear cart");
  }
};

// ---------------------------------------------------------------------------
// Shared helper — always returns a plain-ID object for Payload line items
// ---------------------------------------------------------------------------
const normalizeItemToIds = (item) => ({
  product: typeof item.product === "object" ? item.product.id : item.product,
  variant: typeof item.variant === "object" ? item.variant?.id : item.variant,
  quantity: item.quantity,
  selectedOptions: item.selectedOptions ?? null,
  customTextFieldValues: item.customTextFieldValues ?? [],
  notes: item.notes ?? null,
  addedAt: item.addedAt ?? null,
});

// API-key SDK (no member token) — used for all visitor operations
const apiKeySDK = () => getSDK(null);

// ---------------------------------------------------------------------------
// Visitor cart — get or create
// ---------------------------------------------------------------------------
export const getOrCreateVisitorCart = async (visitorId) => {
  try {
    ensureCoreTenantId();
    const sdk = apiKeySDK();

    const existing = await sdk.find({
      collection: "cart",
      where: buildVisitorCartWhere(visitorId),
      limit: 1,
      depth: 2,
    });

    if (existing.docs?.length > 0) return existing.docs[0];

    return sdk.create({
      collection: "cart",
      data: {
        visitorId,
        tenant: CORE_TENANT_ID,
        lineItems: [],
        status: "active",
      },
    });
  } catch (error) {
    logError("Error getting/creating visitor cart:", error);
    throw new Error(error.message || "Failed to get or create visitor cart");
  }
};

// ---------------------------------------------------------------------------
// Visitor cart — read only
// ---------------------------------------------------------------------------
export const getVisitorCart = async (visitorId) => {
  try {
    ensureCoreTenantId();
    const sdk = apiKeySDK();

    const result = await sdk.find({
      collection: "cart",
      where: buildVisitorCartWhere(visitorId),
      limit: 1,
      depth: 2,
    });

    return hydrateCartForClient(result.docs?.[0] || null);
  } catch (error) {
    logError("Error getting visitor cart:", error);
    throw new Error(error.message || "Failed to get visitor cart");
  }
};

// ---------------------------------------------------------------------------
// Visitor cart — add items
// ---------------------------------------------------------------------------
export const addToVisitorCart = async (visitorId, lineItems) => {
  try {
    const cart = await getOrCreateVisitorCart(visitorId);
    const sdk = apiKeySDK();

    const newItems = lineItems.map(transformLineItem);
    const existingItems = cart.lineItems || [];
    const mergedItems = [...existingItems];

    for (const newItem of newItems) {
      const existingIndex = mergedItems.findIndex((item) => {
        const pid = typeof item.product === "object" ? item.product.id : item.product;
        const vid = typeof item.variant === "object" ? item.variant?.id : item.variant;
        return (
          pid === newItem.product &&
          vid === newItem.variant &&
          JSON.stringify(item.selectedOptions) === JSON.stringify(newItem.selectedOptions) &&
          JSON.stringify(item.customTextFieldValues) === JSON.stringify(newItem.customTextFieldValues)
        );
      });

      if (existingIndex >= 0) {
        mergedItems[existingIndex] = {
          ...normalizeItemToIds(mergedItems[existingIndex]),
          quantity: mergedItems[existingIndex].quantity + newItem.quantity,
        };
      } else {
        mergedItems.push(newItem);
      }
    }

    await sdk.update({
      collection: "cart",
      where: buildVisitorCartWhere(visitorId),
      limit: 1,
      data: { lineItems: mergedItems.map(normalizeItemToIds) },
    });

    return await getVisitorCart(visitorId);
  } catch (error) {
    logError("Error adding to visitor cart:", error);
    throw new Error(error.message || "Failed to add to visitor cart");
  }
};

// ---------------------------------------------------------------------------
// Visitor cart — update quantities
// ---------------------------------------------------------------------------
export const updateVisitorCartQuantity = async (visitorId, updates) => {
  try {
    const cart = await getVisitorCart(visitorId);
    if (!cart) throw new Error("Visitor cart not found");

    const sdk = apiKeySDK();
    const updatedItems = (cart.lineItems || []).map((item) => {
      const update = updates.find((u) => (u._id ? item.id === u._id : item.id === u.id));
      return normalizeItemToIds(update ? { ...item, quantity: update.quantity } : item);
    });

    await sdk.update({
      collection: "cart",
      where: buildVisitorCartWhere(visitorId),
      limit: 1,
      data: { lineItems: updatedItems },
    });

    return await getVisitorCart(visitorId);
  } catch (error) {
    logError("Error updating visitor cart quantity:", error);
    throw new Error(error.message || "Failed to update visitor cart quantity");
  }
};

// ---------------------------------------------------------------------------
// Visitor cart — remove items
// ---------------------------------------------------------------------------
export const removeFromVisitorCart = async (visitorId, lineItemIds) => {
  try {
    const cart = await getVisitorCart(visitorId);
    if (!cart) throw new Error("Visitor cart not found");

    const sdk = apiKeySDK();
    const remainingItems = (cart.lineItems || [])
      .filter((item) => !lineItemIds.includes(item.id))
      .map(normalizeItemToIds);

    await sdk.update({
      collection: "cart",
      where: buildVisitorCartWhere(visitorId),
      limit: 1,
      data: { lineItems: remainingItems },
    });

    return await getVisitorCart(visitorId);
  } catch (error) {
    logError("Error removing from visitor cart:", error);
    throw new Error(error.message || "Failed to remove from visitor cart");
  }
};

// ---------------------------------------------------------------------------
// Visitor cart — delete document
// ---------------------------------------------------------------------------
export const deleteVisitorCart = async (visitorId) => {
  try {
    const cart = await getVisitorCart(visitorId);
    if (!cart) return;

    const sdk = apiKeySDK();
    await sdk.delete({ collection: "cart", where: buildVisitorCartWhere(visitorId) });
  } catch (error) {
    logError("Error deleting visitor cart:", error);
    // Non-fatal — log and continue
  }
};

// ---------------------------------------------------------------------------
// On login: merge visitor cart into member cart, then delete visitor cart
// ---------------------------------------------------------------------------
export const mergeVisitorCartToMember = async (visitorId, memberId, memberToken) => {
  try {
    const visitorCart = await getVisitorCart(visitorId);

    if (!visitorCart || !visitorCart.lineItems?.length) {
      // Nothing to merge — clean up the empty cart if it exists
      if (visitorCart) await deleteVisitorCart(visitorId);
      return;
    }

    const memberCart = await getOrCreateCart(memberId, memberToken);
    const sdk = apiKeySDK();

    const existingItems = memberCart.lineItems || [];
    const mergedItems = [...existingItems];

    for (const visitorItem of visitorCart.lineItems) {
      const normalizedVisitor = normalizeItemToIds(visitorItem);
      const existingIndex = mergedItems.findIndex((item) => {
        const pid = typeof item.product === "object" ? item.product.id : item.product;
        const vid = typeof item.variant === "object" ? item.variant?.id : item.variant;
        return (
          pid === normalizedVisitor.product &&
          vid === normalizedVisitor.variant &&
          JSON.stringify(item.selectedOptions) === JSON.stringify(normalizedVisitor.selectedOptions) &&
          JSON.stringify(item.customTextFieldValues) === JSON.stringify(normalizedVisitor.customTextFieldValues)
        );
      });

      if (existingIndex >= 0) {
        mergedItems[existingIndex] = {
          ...normalizeItemToIds(mergedItems[existingIndex]),
          quantity: mergedItems[existingIndex].quantity + normalizedVisitor.quantity,
        };
      } else {
        mergedItems.push(normalizedVisitor);
      }
    }

    // Write merged items into member cart using the API-key SDK
    // (member token may not have permission to update directly from client)
    await sdk.update({
      collection: "cart",
      where: buildMemberCartWhere(memberId),
      limit: 1,
      data: { lineItems: mergedItems.map(normalizeItemToIds) },
    });

    // Remove visitor cart
    await sdk.delete({ collection: "cart", where: buildVisitorCartWhere(visitorId) });
  } catch (error) {
    logError("Error merging visitor cart to member:", error);
    throw new Error(error.message || "Failed to merge visitor cart");
  }
};
