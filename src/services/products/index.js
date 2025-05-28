import { logError, mapProductSetItems } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

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
            hasSome: [
                {
                    key: "product",
                    values: [id]
                }
            ]
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items;
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