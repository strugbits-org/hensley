"use server";
import { logError, mapProductSetItems } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { getAuthToken } from "../auth";
import { getProductsCart } from "../cart/CartApis";
import { fetchOurCategoriesData } from "..";
import { queryProductById, queryProductsBySlug } from "../payloadCollections";

const baseUrl = process.env.BASE_URL;

export const fetchProductsByCategory = async (id) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "FullProductData",
            includeReferencedItems: ["product"],
            hasSome: [
                {
                    key: "categories",
                    values: [id]
                }
            ],
            sortKey: "order"
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching products by category: ${error.message}`, error);
    }
}

export const fetchCategoriesData = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "Stores/Collections",
            limit: "infinite",
            extendedLimit: 100,
        });

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching category data: ${error.message}`, error);
    }
}

export const fetchProductsByIds = async (ids) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "FullProductData",
            hasSome: [
                {
                    key: "product",
                    values: ids
                }
            ]
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching product data: ${error.message}`, error);
    }
}

export const fetchProductData = async (slug) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "FullProductData",
            includeReferencedItems: ["product"],
            eq: [
                {
                    key: "slug",
                    value: slug
                }
            ]
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items[0];
    } catch (error) {
        logError(`Error fetching product data: ${error.message}`, error);
    }
}

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
        
        // Try to fetch from Payload if we have an ID (could be a Payload product ID)
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

        // Fall back to legacy Wix collection data
        const response = await queryCollection({
            dataCollectionId: "MultipleProductsSet",
            includeReferencedItems: ["products"],
            eq: [
                {
                    key: "product",
                    value: id
                }
            ]
        });
        const productSetItems = mapProductSetItems(response.items[0]);
        if (productSetItems.length === 0) return false;
        return productSetItems;
    } catch (error) {
        logError(`Error fetching product collection data: ${error.message}`, error);
    }
}

export const fetchFeaturedProjects = async (id) => {
    try {
        if (!id || (typeof id !== "string" && typeof id !== "number")) {
            return [];
        }

        const response = await queryCollection({
            dataCollectionId: "PortfolioCollection",
            includeReferencedItems: ["portfolioRef"],
            ne: [
                {
                    key: "isHidden",
                    value: true
                }
            ],
            hasSome: [
                {
                    key: "storeProducts",
                    values: [id]
                }
            ],
            sortKey: "order"
        });

        return Array.isArray(response?.items) ? response.items : [];
    } catch (error) {
        logError(`Error fetching featured projects: ${error.message}`, error);
        return [];
    }
}

export const fetchMatchedProducts = async (id) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "MATCHITWITH",
            includeReferencedItems: ["matchProducts", "productData"],
            eq: [{ key: "product", value: id }],
        });

        // Early return if no items found
        if (!response?.items?.length) {
            return [];
        }

        // Filter out string items and early return if empty
        const matchProducts = response.items[0].matchProducts?.filter(item =>
            item && typeof item === "object" && item._id
        );

        if (!matchProducts?.length) {
            return [];
        }

        // Extract IDs and fetch products
        const productIds = matchProducts.map(item => item._id);
        const products = await fetchProductsByIds(productIds);



        // Create a Map for O(1) lookup instead of find() for each item
        const matchProductsMap = new Map(
            matchProducts.map(product => [product._id, product])
        );
        // Merge products with match data
        return products.map(product => ({
            ...product,
            product: matchProductsMap.get(product.product)
        }));

    } catch (error) {
        return [];
    }
}


export const fetchProductPageDetails = async () => {
    try {
        const pageDetails = await queryCollection({ dataCollectionId: "dynamicProductPageDetails" });

        if (!Array.isArray(pageDetails.items)) {
            throw new Error(`PrivacyPolicy response does not contain items array`);
        }

        return pageDetails.items[0]

    } catch (error) {
        logError(`Error fetching contact page data: ${error.message}`, error);
    }
};

export const fetchProductPageData = async (slug) => {
    try {
        // Fetch Payload product and legacy Wix wrapper in parallel;
        // Payload is the source of truth for product display data,
        // Wix wrapper only supplies the _id needed for dependent collections/projects/matches.
        const [coreProductData, wixProductData] = await Promise.all([
            queryProductsBySlug(slug),
            fetchProductData(slug).catch(() => null),
        ]);

        if (!coreProductData) {
            throw new Error("Product data not found");
        }

        const wixProductId = wixProductData?.product?._id;

        // Check if this is a Payload bundle product
        const isPayloadBundle = coreProductData.type === 'bundle' && 
            Array.isArray(coreProductData.bundleItems) && 
            coreProductData.bundleItems.length > 0;

        const [
            legacyProductCollectionData,
            featuredProjectsData,
            matchedProducts,
            pageDetails,
            ourCategoriesData
        ] = await Promise.all([
            // Only fetch legacy collection data if not a Payload bundle
            isPayloadBundle ? Promise.resolve(null) : fetchProductCollectionData(wixProductId),
            fetchFeaturedProjects(wixProductId),
            fetchMatchedProducts(wixProductId),
            fetchProductPageDetails(),
            fetchOurCategoriesData()
        ]);

        // Use Payload bundle items or legacy collection data
        const productCollectionData = isPayloadBundle 
            ? mapBundleItemsToCollectionData(coreProductData.bundleItems)
            : legacyProductCollectionData;

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
            ourCategoriesData
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
    try {
        const response = await queryCollection({
            dataCollectionId: "FullProductData",
            limit: "infinite",
            extendedLimit: 1000
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items.map(x => ({ slug: x.slug.trim().replace("/", "") }));
    } catch (error) {
        logError(`Error fetching products by category: ${error.message}`, error);
    }
}

export const fetchAllProducts = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "FullProductData",
            includeReferencedItems: ["product"],
            limit: "infinite",
            extendedLimit: 1000
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items.filter(x => typeof x.product !== "string" && x.product);
    } catch (error) {
        logError(`Error fetching products: ${error.message}`, error);
    }
}

export const queryProducts = async (query) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "FullProductData",
            includeReferencedItems: ["product"],
            contains: ["content", query],
            limit: 100,
            sortOrder: "asc",
            sortKey: "title",
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching products by category: ${error.message}`, error);
    }
}