"use server";
import { cache } from "react";
import { logError, normalizeProductForDisplay } from "@/utils";
import { getAuthToken } from "../auth";
import { getProductsCart } from "../cart/CartApis";
import { queryProductById, queryProductsByCollectionIds, queryProductsBySlug, queryProjects, normalizePayloadProjectForListing, queryProductCollections, queryProductsByIds, queryAllProducts, queryProductsFromPayload, queryProductSlugs, querySection, sectionToObject } from "../payloadCollections";

// Field set FeaturedProjects (PDP/tent/pool-cover) + the Tents listing actually
// render: portfolioRef.{title, slug, coverImage.imageInfo}. Listing slim already
// covers it — reuse PROJECT_LISTING_SELECT-equivalent fields here so the
// featured fetch stays small and drops gallery/hero/testimonial/storeProducts.
const FEATURED_PROJECT_SELECT = {
    title: true,
    slug: true,
    description: true,
    coverImage: true,
    publishDate: true,
    publishedDate: true,
    order: true,
    isHidden: true,
    markets: true,
    studios: true,
    portfolioCategories: true,
};

const baseUrl = process.env.BASE_URL;

export const fetchProductsByCategory = async (id) => {
    try {
        if (!id) return [];
        const result = await queryProductsByCollectionIds([id]);
        return Array.isArray(result?.docs) ? result.docs : [];
    } catch (error) {
        logError(`Error fetching products by category: ${error.message}`, error);
        return [];
    }
}

export const fetchCategoriesData = async () => {
    try {
        const docs = await queryProductCollections();
        return Array.isArray(docs) ? docs : [];
    } catch (error) {
        logError(`Error fetching category data: ${error.message}`, error);
        return [];
    }
}

export const fetchProductsByIds = async (ids) => {
    try {
        if (!ids || !ids.length) return [];
        return await queryProductsByIds(ids);
    } catch (error) {
        logError(`Error fetching product data: ${error.message}`, error);
        return [];
    }
}

// fetchProductData removed — wixProductId is no longer needed.
// product.recommendedProducts and product.collections are resolved directly from bps-core.

/**
 * Map Payload bundle items to the expected productCollectionData format
 */
const mapBundleItemsToCollectionData = (bundleItems) => {
    if (!Array.isArray(bundleItems) || bundleItems.length === 0) return null;

    return bundleItems
        .filter(item => item.product && typeof item.product === 'object')
        .map(item => {
            const product = item.product;
            return {
                product: {
                    _id: product.id || product._id,
                    id: product.id || product._id,
                    name: product.title,
                    title: product.title,
                    price: product.price || 0,
                    formattedPrice: product.price ? `$${product.price.toFixed(2)}` : '$0.00',
                    additionalInfoSections: product.additionalInfoSections || [],
                },
                quantity: item.quantity || 1,
                required: !!item.required,
                variant: item.variant,
            };
        });
};

export const fetchProductCollectionData = async (id, productData = null) => {
    try {
        // First check if this is a Payload bundle product
        // productData may be passed directly from the modal with bundle info
        let product = productData;
        
        // If productData has bundleItems, use them directly
        if (product?.type === 'bundle' && Array.isArray(product.bundleItems) && product.bundleItems.length > 0) {
            const bundleItems = mapBundleItemsToCollectionData(product.bundleItems);
            if (bundleItems && bundleItems.length > 0) {
                return bundleItems;
            }
        }
        
        // Try to fetch from Payload if we have an ID
        if (id) {
            const payloadProduct = await queryProductById(id);
            if (payloadProduct?.type === 'bundle' && 
                Array.isArray(payloadProduct.bundleItems) && 
                payloadProduct.bundleItems.length > 0) {
                const bundleItems = mapBundleItemsToCollectionData(payloadProduct.bundleItems);
                if (bundleItems && bundleItems.length > 0) {
                    return bundleItems;
                }
            }
        }

        return false;
    } catch (error) {
        logError(`Error fetching product collection data: ${error.message}`, error);
        return false;
    }
}

// Request-cached + slimmed. FeaturedProjects/OurProjects sliders only render
// portfolioRef.{title,slug,coverImage.imageInfo} so we skip depth:2 hydration
// of hero, galleryImages, testimonial, storeProducts, meta. cache() dedupes the
// per-tent fan-out on /types-of-tents within a single request.
export const fetchFeaturedProjects = cache(async (id) => {
    try {
        if (!id || (typeof id !== "string" && typeof id !== "number")) {
            return [];
        }
        const payloadProjects = await queryProjects({
            where: { storeProducts: { contains: id } },
            sort: "order",
            depth: 1,
            select: FEATURED_PROJECT_SELECT,
        });
        return payloadProjects.map(normalizePayloadProjectForListing);
    } catch (error) {
        logError(`Error fetching featured projects: ${error.message}`, error);
        return [];
    }
})

// fetchMatchedProducts removed — replaced by product.recommendedProducts from bps-core.

const getPayloadCollectionIds = (product = {}) => {
    const collectionsSource = product?.collections || product?.productCollections || product?.productCollection || product?.collection;
    const collections = Array.isArray(collectionsSource) ? collectionsSource : collectionsSource ? [collectionsSource] : [];

    return collections
        .map((collection) => {
            if (typeof collection === "string") return collection;
            if (collection && typeof collection === "object") {
                return collection.id || collection._id || collection.value?.id || collection.value?._id;
            }

            return null;
        })
        .filter(Boolean);
};

const fetchMatchedProductsFromCollections = async (product = {}) => {
    const productId = product?.id || product?._id;
    const collectionIds = getPayloadCollectionIds(product);

    if (!productId || collectionIds.length === 0) {
        return [];
    }

    const response = await queryProductsByCollectionIds(collectionIds);
    const relatedProducts = Array.isArray(response?.docs) ? response.docs : [];
    const seenProductIds = new Set();

    return relatedProducts
        .filter((relatedProduct) => {
            const relatedProductId = relatedProduct?.id || relatedProduct?._id;

            if (!relatedProductId || relatedProductId === productId || seenProductIds.has(relatedProductId)) {
                return false;
            }

            seenProductIds.add(relatedProductId);
            return true;
        })
        .map((relatedProduct) => ({
            product: normalizeProductForDisplay(relatedProduct),
        }));
};

export const fetchMatchedProductsForProduct = async ({ payloadProduct = null } = {}) => {
    try {
        // Prefer recommendedProducts relationship from bps-core (populated at depth>=2)
        const recommended = Array.isArray(payloadProduct?.recommendedProducts)
            ? payloadProduct.recommendedProducts
            : [];
        if (recommended.length > 0) {
            return recommended
                .filter(p => p && typeof p === 'object')
                .map(p => ({ product: normalizeProductForDisplay(p) }));
        }
        // Fall back to products in the same collections
        // return await fetchMatchedProductsFromCollections(payloadProduct);
        return [];
    } catch (error) {
        logError(`Error fetching matched products for product page: ${error.message}`, error);
        return [];
    }
};


export const fetchProductPageDetails = cache(async () => {
    const fallback = {
        matchItWithTitle: "MATCH IT WITH",
        featuredProductTitle: "Products Featured in this Project Entry",
    };
    try {
        const section = await querySection("dynamic-product-page-details");
        if (section) {
            return { ...fallback, ...sectionToObject(section) };
        }
    } catch (error) {
        logError(`Error fetching product page details: ${error.message}`, error);
    }
    return fallback;
});

export const fetchProductPageData = async (slug) => {
    // Fetch the core product first. Only a genuine "no such slug" should 404;
    // transient SDK/network errors are re-thrown so Next renders an error page
    // (and won't be cached as a 404).
    let coreProductData;
    try {
        coreProductData = await queryProductsBySlug(slug);
    } catch (error) {
        logError(`Error fetching core product for slug "${slug}": ${error.message}`, error);
        throw error;
    }

    if (!coreProductData) {
        return null;
    }

    const isPayloadBundle = coreProductData.type === 'bundle' &&
        Array.isArray(coreProductData.bundleItems) &&
        coreProductData.bundleItems.length > 0;

    // Auxiliary data — a transient failure here must NOT 404 the page.
    const [
        featuredProjectsResult,
        matchedProductsResult,
        pageDetailsResult,
        allCollectionsResult,
    ] = await Promise.allSettled([
        fetchFeaturedProjects(coreProductData.id || coreProductData._id),
        fetchMatchedProductsForProduct({ payloadProduct: coreProductData }),
        fetchProductPageDetails(),
        queryProductCollections(),
    ]);

    const settledValue = (result, fallback) => {
        if (result.status === "fulfilled") return result.value;
        logError(`Auxiliary product-page fetch failed: ${result.reason?.message}`, result.reason);
        return fallback;
    };

    const productCollectionData = isPayloadBundle
        ? mapBundleItemsToCollectionData(coreProductData.bundleItems)
        : false;

    return {
        productData: {
            product: coreProductData,
            isProductCollection: Boolean(productCollectionData),
            isBundle: isPayloadBundle,
        },
        productCollectionData,
        featuredProjectsData: settledValue(featuredProjectsResult, []),
        matchedProducts: settledValue(matchedProductsResult, []),
        pageDetails: settledValue(pageDetailsResult, { matchItWithTitle: "MATCH IT WITH", featuredProductTitle: "Products Featured in this Project Entry" }),
        allCollections: (() => {
            const v = settledValue(allCollectionsResult, []);
            return Array.isArray(v) ? v : [];
        })(),
    };
}

export const fetchSavedProductData = async (includeProducts = false, retries = 3, delay = 1000) => {
    const retryDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const authToken = await getAuthToken();
            if (!authToken) return [];

            const payload = {};

            if (includeProducts) {
                payload.includeProducts = true;
            }

            const response = await fetch(`${baseUrl}/api/product/getSavedProducts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                },
                body: JSON.stringify(payload),
                cache: "no-store",
            });

            // Background wishlist prefetch (runs once per full page load via
            // SavedProductsHandler). It must NEVER log the user out — doing so on a
            // 401 here was the production reload-logout bug. Auth enforcement lives
            // in middleware + explicit user actions, not in this passive prefetch.
            if (response.status === 401) {
                return [];
            }

            const data = await response.json();

            if (data && data.items) {
                return data.items;
            } else {
                throw new Error("Response does not contain _items", response);
            }
        } catch (error) {
            if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;

            logError(`Error fetching saved products: Attempt ${attempt + 1} failed: ${error}`);

            if (attempt < retries) {
                logError(`Retrying in ${delay}ms...`);
                await retryDelay(delay);
                delay *= 2;
            } else {
                logError(`Attempt ${attempt} failed. No more retries left.`);
                return [];
            }
        }
    }
};

export const saveProduct = async (id) => {
    try {
        const authToken = await getAuthToken();

        const response = await fetch(`${baseUrl}/api/product/saveProduct/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logError("Error saving product:", error);
        throw new Error(error.message);
    }
};

export const unSaveProduct = async (id) => {
    try {
        const authToken = await getAuthToken();
        const response = await fetch(
            `${baseUrl}/api/product/removeSavedProduct/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                },
            }
        );
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logError("Error removing product:", error);
        throw new Error(error.message);
    }
};

export const checkProductInCart = async (productId, isProductCollection = false) => {
    try {
        if (!isProductCollection) return false;
        const cart = await getProductsCart();
        if (!cart?.lineItems) return false;
        
        // Support both Payload format (productId, product.id) and legacy Wix format (catalogReference.catalogItemId)
        const existingItem = cart.lineItems.find((item) => {
            const itemProductId = item.productId || 
                (typeof item.product === 'object' ? item.product?.id || item.product?._id : item.product) ||
                item.catalogReference?.catalogItemId;
            return itemProductId === productId;
        });
        return existingItem || false;
    } catch (error) {
        logError("Error fetching cart items:", error);
    }
};

export const fetchProductPaths = async () => {
    try {
        const docs = await queryProductSlugs();
        const seen = new Set();
        return docs.reduce((acc, doc) => {
            const slug = (doc?.slug || "").trim().replace(/^\//, "");
            if (slug && !seen.has(slug)) {
                seen.add(slug);
                acc.push({ slug });
            }
            return acc;
        }, []);
    } catch (error) {
        logError(`Error fetching product paths: ${error.message}`, error);
        return [];
    }
}

export const fetchAllProducts = async () => {
    try {
        return await queryAllProducts({ depth: 1 });
    } catch (error) {
        logError(`Error fetching products: ${error.message}`, error);
        return [];
    }
}