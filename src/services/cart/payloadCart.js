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

const hydrateCartForClient = async (cart) => {
  if (!cart || !Array.isArray(cart.lineItems)) return cart;

  const productIds = [...new Set(
    cart.lineItems
      .map((item) => {
        if (typeof item?.product === "string") return item.product;
        if (typeof item?.product === "object") return item.product?.id || item.product?._id;
        return null;
      })
      .filter(Boolean),
  )];

  let productMap = new Map();

  // If relationship population is missing, fetch products explicitly by ID.
  if (productIds.length > 0) {
    try {
      const sdk = getSDK(null);
      const productsResult = await sdk.find({
        collection: "products",
        where: {
          id: { in: productIds },
        },
        pagination: false,
        depth: 1,
      });

      productMap = new Map(
        (productsResult?.docs || []).map((product) => [product?.id || product?._id, product]),
      );
    } catch (error) {
      logError("Error enriching cart product data:", error);
    }
  }

  return {
    ...cart,
    lineItems: cart.lineItems.map((item) => {
      const relationshipProduct = typeof item?.product === "object" ? item.product : null;
      const productId =
        (typeof item?.product === "string" ? item.product : null) ||
        relationshipProduct?.id ||
        relationshipProduct?._id;

      const enrichedProduct = relationshipProduct || productMap.get(productId) || null;
      const productShape = enrichedProduct ? { ...item, product: enrichedProduct } : item;

      return {
        ...item,
        product: enrichedProduct || item.product,
        _id: item?._id || item?.id,
        id: item?.id || item?._id,
        productId,
        name: item?.name || enrichedProduct?.name || enrichedProduct?.title || "",
        price: Number(item?.priceAtAdd ?? item?.price ?? enrichedProduct?.price ?? 0) || 0,
        image: resolveLineItemImage(productShape),
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

const getCartDocId = (cart) => cart?.id || cart?._id;

const patchCartByDocId = async (docId, data) => {
  const response = await fetch(`${CORE_API_BASE_URL}/api/cart/${docId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CORE_API_KEY}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.message || json?.message || "Failed to update cart");
  }

  return json?.doc || json;
};

const deleteCartByDocId = async (docId) => {
  const response = await fetch(`${CORE_API_BASE_URL}/api/cart/${docId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${CORE_API_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    throw new Error(json?.errors?.[0]?.message || json?.message || "Failed to delete cart");
  }
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
      return await hydrateCartForClient(existingCarts.docs[0]);
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

    return await hydrateCartForClient(newCart);
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

    return await hydrateCartForClient(result.docs?.[0] || null);
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
      const newItemKey = getComparableLineItemKey(newItem);
      const existingIndex = mergedItems.findIndex((item) => getComparableLineItemKey(item) === newItemKey);

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
          quantity: Number(mergedItems[existingIndex].quantity || 0) + Number(newItem.quantity || 0),
        };
      } else {
        // Add new item
        mergedItems.push(newItem);
      }
    }

    // Normalize all items to use IDs and strip unsupported nested fields
    const normalizedItems = mergedItems.map(normalizeItemToIds);

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
        return normalizeItemToIds({ ...item, quantity: update.quantity });
      }

      return normalizeItemToIds(item);
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
      .map(normalizeItemToIds);

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
const sanitizeCustomTextFieldValues = (customTextFieldValues) => {
  if (!Array.isArray(customTextFieldValues)) return [];

  return customTextFieldValues
    .map((field) => ({
      title: typeof field?.title === "string" ? field.title : String(field?.title || ""),
      value: typeof field?.value === "string" ? field.value : String(field?.value || ""),
    }))
    .filter((field) => field.title);
};

const normalizeItemToIds = (item) => ({
  product: typeof item.product === "object" ? item.product.id : item.product,
  variant: typeof item.variant === "object" ? item.variant?.id : item.variant,
  quantity: item.quantity,
  selectedOptions: item.selectedOptions ?? null,
  customTextFieldValues: sanitizeCustomTextFieldValues(item.customTextFieldValues),
  notes: item.notes ?? null,
  addedAt: item.addedAt ?? null,
});

const normalizeSelectedOptionsForCompare = (value) => {
  if (!value || typeof value !== "object") return null;

  if (Array.isArray(value)) {
    const normalizedArray = value
      .map((item) => normalizeSelectedOptionsForCompare(item))
      .filter((item) => item !== null && item !== undefined);
    return normalizedArray.length ? normalizedArray : null;
  }

  const normalizedObject = Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      const normalizedValue = normalizeSelectedOptionsForCompare(value[key]);
      if (normalizedValue !== null && normalizedValue !== undefined && normalizedValue !== "") {
        acc[key] = normalizedValue;
      }
      return acc;
    }, {});

  return Object.keys(normalizedObject).length ? normalizedObject : null;
};

const normalizeCustomTextForCompare = (customTextFieldValues) => {
  if (!Array.isArray(customTextFieldValues)) return [];

  return customTextFieldValues
    .map((field) => ({
      title: String(field?.title || "").trim().toLowerCase(),
      value: String(field?.value || "").trim(),
    }))
    .filter((field) => field.title)
    .sort((left, right) => left.title.localeCompare(right.title));
};

const getComparableLineItemKey = (item) => {
  const normalized = normalizeItemToIds(item);
  return JSON.stringify({
    product: normalized.product || null,
    variant: normalized.variant || null,
    selectedOptions: normalizeSelectedOptionsForCompare(normalized.selectedOptions),
    customTextFieldValues: normalizeCustomTextForCompare(normalized.customTextFieldValues),
  });
};

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

    return await hydrateCartForClient(result.docs?.[0] || null);
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
      const newItemKey = getComparableLineItemKey(newItem);
      const existingIndex = mergedItems.findIndex((item) => getComparableLineItemKey(item) === newItemKey);

      if (existingIndex >= 0) {
        mergedItems[existingIndex] = {
          ...normalizeItemToIds(mergedItems[existingIndex]),
          quantity: Number(mergedItems[existingIndex].quantity || 0) + Number(newItem.quantity || 0),
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
    const memberCartId = getCartDocId(memberCart);
    const visitorCartId = getCartDocId(visitorCart);

    if (!memberCartId) {
      throw new Error("Member cart ID not found for merge");
    }

    if (!visitorCartId) {
      throw new Error("Visitor cart ID not found for merge");
    }

    const existingItems = memberCart.lineItems || [];
    const mergedItems = [...existingItems];

    for (const visitorItem of visitorCart.lineItems) {
      const normalizedVisitor = normalizeItemToIds(visitorItem);
      const visitorItemKey = getComparableLineItemKey(normalizedVisitor);
      const existingIndex = mergedItems.findIndex((item) => getComparableLineItemKey(item) === visitorItemKey);

      if (existingIndex >= 0) {
        mergedItems[existingIndex] = {
          ...normalizeItemToIds(mergedItems[existingIndex]),
          quantity:
            Number(mergedItems[existingIndex].quantity || 0) + Number(normalizedVisitor.quantity || 0),
        };
      } else {
        mergedItems.push(normalizedVisitor);
      }
    }

    // Write merged items into member cart by explicit document ID.
    await patchCartByDocId(memberCartId, {
      lineItems: mergedItems.map(normalizeItemToIds),
    });

    // Remove visitor cart by explicit document ID.
    await deleteCartByDocId(visitorCartId);
  } catch (error) {
    logError("Error merging visitor cart to member:", error);
    throw new Error(error.message || "Failed to merge visitor cart");
  }
};
