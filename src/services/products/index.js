"use server";
import { logError, mapProductSetItems } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { getAuthToken } from "../auth";
import { getProductsCart } from "../cart/CartApis";

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

export const fetchProductCollectionData = async (id) => {
    try {
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
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching featured projects: ${error.message}`, error);
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

export const fetchProductPageData = async (slug) => {
    try {
        const productData = await fetchProductData(slug);
        if (!productData || !productData.product) {
            throw new Error("Product data not found");
        }
        const productId = productData.product._id;
        const [
            productCollectionData,
            featuredProjectsData,
            matchedProducts
        ] = await Promise.all([
            fetchProductCollectionData(productId),
            fetchFeaturedProjects(productId),
            fetchMatchedProducts(productId)
        ]);

        return {
            productData,
            productCollectionData,
            featuredProjectsData,
            matchedProducts
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
        const existingItem = cart.lineItems.find((item) => item.catalogReference.catalogItemId === productId);
        return existingItem || false;
    } catch (error) {
        logError("Error fetching cart items:", error);
    }
};
