"use server";
/**
 * Payload CMS Saved Products (Wishlist) Service
 * Handles saved products/wishlist operations with the Payload CMS backend (bps-core)
 */

import { logError, resolveCoreMediaUrl } from "@/utils";
import { getSDK as _getSDK, ensureCoreTenantId, CORE_API_BASE_URL, CORE_API_KEY, CORE_TENANT_ID } from "../payloadSDK";

const resolveProductImage = (product) => {
  if (!product) return "";
  const firstMediaItem = Array.isArray(product?.mediaItems) ? product.mediaItems[0] : null;
  return resolveCoreMediaUrl(
    product?.mainMedia ||
    product?.featuredImage ||
    firstMediaItem ||
    "",
    "card",
  );
};

const getSDK = _getSDK;

const buildMemberWishlistWhere = (memberId) => ({
  and: [
    { member: { equals: memberId } },
    { tenant: { equals: CORE_TENANT_ID } },
  ],
});

const getWishlistDocId = (wishlist) => wishlist?.id || wishlist?._id;

/**
 * Hydrate saved products for client with full product data
 */
const hydrateWishlistForClient = async (wishlist, includeProducts = false) => {
  if (!wishlist || !Array.isArray(wishlist.items)) {
    return { items: [], itemCount: 0 };
  }

  if (!includeProducts) {
    // Return just the product IDs for quick checks
    return {
      items: wishlist.items.map((item) => ({
        _id: item._id || item.id,
        product: typeof item.product === "object" 
          ? item.product?.id || item.product?._id 
          : item.product,
        savedAt: item.savedAt,
      })),
      itemCount: wishlist.itemCount || wishlist.items.length,
    };
  }

  // Get unique product IDs that need enrichment
  const productIds = [
    ...new Set(
      wishlist.items
        .map((item) => {
          if (typeof item?.product === "string") return item.product;
          if (typeof item?.product === "object") return item.product?.id || item.product?._id;
          return null;
        })
        .filter(Boolean)
    ),
  ];

  let productMap = new Map();

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
        (productsResult?.docs || []).map((product) => [product?.id || product?._id, product])
      );
    } catch (error) {
      logError("Error enriching saved products data:", error);
    }
  }

  // Return enriched items in a format compatible with existing frontend
  return {
    items: wishlist.items.map((item) => {
      const relationshipProduct = typeof item?.product === "object" ? item.product : null;
      const productId =
        (typeof item?.product === "string" ? item.product : null) ||
        relationshipProduct?.id ||
        relationshipProduct?._id;

      const enrichedProduct = relationshipProduct || productMap.get(productId) || null;

      if (!enrichedProduct) {
        return null;
      }

      // Normalize product data - map 'title' to 'name' for frontend compatibility
      const normalizedProduct = {
        ...enrichedProduct,
        _id: enrichedProduct.id || enrichedProduct._id,
        name: enrichedProduct.name || enrichedProduct.title,
        // Resolve mainMedia URL
        mainMedia: enrichedProduct.mainMedia 
          ? (typeof enrichedProduct.mainMedia === 'object'
            ? { ...enrichedProduct.mainMedia, url: resolveProductImage(enrichedProduct) }
            : resolveProductImage(enrichedProduct))
          : null,
      };

      // Return format compatible with SecondaryProductCard
      // SecondaryProductCard expects { product: { name, slug, mainMedia, _id } }
      return {
        _id: item._id || item.id || productId,
        product: normalizedProduct,
        savedAt: item.savedAt,
        priceWhenSaved: item.priceWhenSaved,
      };
    }).filter(Boolean),
    itemCount: wishlist.itemCount || wishlist.items.length,
  };
};

/**
 * Get or create wishlist for a member
 * @param {string} memberId - The member's ID
 * @param {string} token - The member's auth token
 * @returns {Promise<object>} The wishlist document
 */
export const getOrCreateWishlist = async (memberId, token) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    // Try to find existing wishlist for this member and tenant
    const existingWishlists = await sdk.find({
      collection: "saved-products",
      where: buildMemberWishlistWhere(memberId),
      limit: 1,
      depth: 2, // Include product details
    });

    if (existingWishlists.docs?.length > 0) {
      return existingWishlists.docs[0];
    }

    // Create new wishlist for member
    const newWishlist = await sdk.create({
      collection: "saved-products",
      data: {
        member: memberId,
        tenant: CORE_TENANT_ID,
        items: [],
        itemCount: 0,
      },
    });

    return newWishlist.doc || newWishlist;
  } catch (error) {
    logError("Error getting/creating wishlist:", error);
    throw error;
  }
};

/**
 * Get saved products for a member
 * @param {string} memberId - The member's ID
 * @param {string} token - The member's auth token
 * @param {boolean} includeProducts - Whether to include full product data
 * @returns {Promise<object>} The saved products list
 */
export const getSavedProducts = async (memberId, token, includeProducts = false) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    const existingWishlists = await sdk.find({
      collection: "saved-products",
      where: buildMemberWishlistWhere(memberId),
      limit: 1,
      depth: includeProducts ? 2 : 1,
    });

    if (existingWishlists.docs?.length > 0) {
      return await hydrateWishlistForClient(existingWishlists.docs[0], includeProducts);
    }

    return { items: [], itemCount: 0 };
  } catch (error) {
    logError("Error getting saved products:", error);
    throw error;
  }
};

/**
 * Save a product to the wishlist
 * @param {string} memberId - The member's ID
 * @param {string} productId - The product ID to save
 * @param {string} token - The member's auth token
 * @returns {Promise<object>} Result
 */
export const saveProduct = async (memberId, productId, token) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    // Get or create wishlist
    const wishlist = await getOrCreateWishlist(memberId, token);
    const wishlistId = getWishlistDocId(wishlist);

    // Check if product is already saved
    const existingItems = wishlist.items || [];
    const alreadySaved = existingItems.some((item) => {
      const itemProductId = typeof item.product === "object" 
        ? item.product?.id || item.product?._id 
        : item.product;
      return itemProductId === productId;
    });

    if (alreadySaved) {
      return { message: "Product already saved", alreadySaved: true };
    }

    // Get product details to capture price
    let priceWhenSaved = null;
    try {
      const productResult = await sdk.findByID({
        collection: "products",
        id: productId,
        depth: 0,
      });
      // Handle both price formats: { amount: number } or number
      const rawPrice = productResult?.price;
      priceWhenSaved = rawPrice?.amount ?? rawPrice ?? productResult?.basePrice ?? null;
      if (priceWhenSaved !== null) {
        priceWhenSaved = Number(priceWhenSaved) || null;
      }
    } catch (e) {
      // Product price fetch failed, continue without it
      logError("Could not fetch product price:", e);
    }

    // Add product to items
    const newItem = {
      product: productId,
      priceWhenSaved,
      savedAt: new Date().toISOString(),
    };

    const updatedItems = [...existingItems, newItem];

    // Update wishlist via PATCH
    const response = await fetch(`${CORE_API_BASE_URL}/api/saved-products/${wishlistId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : `Bearer ${CORE_API_KEY}`,
      },
      body: JSON.stringify({
        items: updatedItems,
      }),
      cache: "no-store",
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.errors?.[0]?.message || json?.message || "Failed to save product");
    }

    return { message: "Product saved successfully" };
  } catch (error) {
    logError("Error saving product:", error);
    throw error;
  }
};

/**
 * Remove a product from the wishlist
 * @param {string} memberId - The member's ID
 * @param {string} productId - The product ID to remove
 * @param {string} token - The member's auth token
 * @returns {Promise<object>} Result
 */
export const unsaveProduct = async (memberId, productId, token) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    // Find existing wishlist
    const existingWishlists = await sdk.find({
      collection: "saved-products",
      where: buildMemberWishlistWhere(memberId),
      limit: 1,
      depth: 1,
    });

    if (!existingWishlists.docs?.length) {
      return { message: "No saved products found" };
    }

    const wishlist = existingWishlists.docs[0];
    const wishlistId = getWishlistDocId(wishlist);
    const existingItems = wishlist.items || [];

    // Filter out the product
    const updatedItems = existingItems.filter((item) => {
      const itemProductId = typeof item.product === "object" 
        ? item.product?.id || item.product?._id 
        : item.product;
      return itemProductId !== productId;
    });

    if (updatedItems.length === existingItems.length) {
      return { message: "Product not found in saved products" };
    }

    // Update wishlist via PATCH
    const response = await fetch(`${CORE_API_BASE_URL}/api/saved-products/${wishlistId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : `Bearer ${CORE_API_KEY}`,
      },
      body: JSON.stringify({
        items: updatedItems,
      }),
      cache: "no-store",
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.errors?.[0]?.message || json?.message || "Failed to remove product");
    }

    return { message: "Product removed successfully" };
  } catch (error) {
    logError("Error removing saved product:", error);
    throw error;
  }
};

/**
 * Check if a product is saved
 * @param {string} memberId - The member's ID
 * @param {string} productId - The product ID to check
 * @param {string} token - The member's auth token
 * @returns {Promise<boolean>} Whether the product is saved
 */
export const isProductSaved = async (memberId, productId, token) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    const existingWishlists = await sdk.find({
      collection: "saved-products",
      where: buildMemberWishlistWhere(memberId),
      limit: 1,
      depth: 0,
    });

    if (!existingWishlists.docs?.length) {
      return false;
    }

    const wishlist = existingWishlists.docs[0];
    const items = wishlist.items || [];

    return items.some((item) => {
      const itemProductId = typeof item.product === "object" 
        ? item.product?.id || item.product?._id 
        : item.product;
      return itemProductId === productId;
    });
  } catch (error) {
    logError("Error checking if product is saved:", error);
    return false;
  }
};
