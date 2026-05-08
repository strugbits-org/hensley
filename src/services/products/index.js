"use server";
import { logError, mapProductSetItems, normalizeProductForDisplay } from "@/utils";
import { getAuthToken } from "../auth";
import { getProductsCart } from "../cart/CartApis";
import { fetchOurCategoriesData } from "..";
import { queryProductById, queryProductsByCollectionIds, queryProductsBySlug, queryProjects, normalizePayloadProject, queryProductCollections, queryProductsByIds, queryAllProducts, queryProductsFromPayload } from "../payloadCollections";


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
                optional: item.optional || false,
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

export const fetchFeaturedProjects = async (id) => {
    try {
        if (!id || (typeof id !== "string" && typeof id !== "number")) {
            return [];
        }
        const payloadProjects = await queryProjects({
            where: { storeProducts: { contains: id } },
            sort: "order",
        });
        return payloadProjects.map(normalizePayloadProject);
    } catch (error) {
        logError(`Error fetching featured projects: ${error.message}`, error);
        return [];
    }
}

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
        return await fetchMatchedProductsFromCollections(payloadProduct);
    } catch (error) {
        logError(`Error fetching matched products for product page: ${error.message}`, error);
        return [];
    }
};


export const fetchProductPageDetails = async () => {
    return {
        matchItWithTitle: "MATCH IT WITH",
        featuredProductTitle: "Products Featured in this Project Entry",
    };
};

export const fetchProductPageData = async (slug) => {
    try {
        // Fetch Payload product — source of truth for all display data
        const coreProductData = await queryProductsBySlug(slug);

        if (!coreProductData) {
            throw new Error("Product data not found");
        }

        // Check if this is a Payload bundle product
        const isPayloadBundle = coreProductData.type === 'bundle' && 
            Array.isArray(coreProductData.bundleItems) && 
            coreProductData.bundleItems.length > 0;

        const [
            featuredProjectsData,
            matchedProducts,
            pageDetails,
            ourCategoriesData,
            allCollections,
        ] = await Promise.all([
            fetchFeaturedProjects(coreProductData.id || coreProductData._id),
            fetchMatchedProductsForProduct({ payloadProduct: coreProductData }),
            fetchProductPageDetails(),
            fetchOurCategoriesData(),
            queryProductCollections(),
        ]);

        // Use Payload bundle items for collection data
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
            featuredProjectsData,
            matchedProducts,
            pageDetails,
            ourCategoriesData,
            allCollections: Array.isArray(allCollections) ? allCollections : [],
        };
    } catch (error) {
        logError(`Error fetching product data: ${error.message}`, error);
    }
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

            const data = await response.json();

            if (data && data.items) {
                return data.items;
            } else {
                throw new Error("Response does not contain _items", response);
            }
        } catch (error) {
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
    // Returns empty so Next.js generates product pages on-demand (ISR)
    return [];
}

export const fetchAllProducts = async () => {
    try {
        return await queryAllProducts({ depth: 1 });
    } catch (error) {
        logError(`Error fetching products: ${error.message}`, error);
        return [];
    }
}