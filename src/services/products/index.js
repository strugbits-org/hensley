import { logError, mapProductSetItems } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { getAuthToken } from "../auth";

const baseUrl = process.env.BASE_URL;

export const fetchProductsByCategory = async (id) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "ProductsSearchContent",
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

export const fetchProductData = async (id) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "ProductsSearchContent",
            eq: [
                {
                    key: "product",
                    value: id
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
            includeReferencedItems: ["matchProducts"],
            eq: [
                {
                    key: "product",
                    value: id
                }
            ],
        });
        if (!Array.isArray(response.items) || response.items.length === 0) {
            throw new Error(`Response does not contain items array`);
        }

        const data = response.items[0].matchProducts.filter(item => typeof item !== "string");
        return data;
    } catch (error) {
        logError(`Error fetching matched products: ${error.message}`, error);
    }
}

export const fetchProductId = async (slug) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "Stores/Products",
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
        logError(`Error fetching product ID: ${error.message}`, error);
    }
}

export const fetchProductPageData = async (slug) => {
    try {
        const product = await fetchProductId(slug);
        const productId = product._id;
        const [
            productData,
            productCollectionData,
            featuredProjectsData,
            matchedProducts
        ] = await Promise.all([
            fetchProductData(productId),
            fetchProductCollectionData(productId),
            fetchFeaturedProjects(productId),
            fetchMatchedProducts(productId)
        ]);

        if (!productData) {
            throw new Error(`Response does not contain items array`);
        }

        return {
            productData: {
                ...productData,
                product
            },
            productCollectionData,
            featuredProjectsData,
            matchedProducts
        };
    } catch (error) {
        logError(`Error fetching product data: ${error.message}`, error);
    }
}

export const fetchSavedProductData = async (retries = 3, delay = 1000) => {
    const retryDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const authToken = await getAuthToken();
            if (!authToken) return [];

            const response = await fetch(`${baseUrl}/api/product/getSavedProducts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                },
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