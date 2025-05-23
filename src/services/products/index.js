import { logError } from "@/utils";
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
        const productData = await fetchProductData(product._id);

        return {
            productData: {
                ...productData,
                product
            }
        };
    } catch (error) {
        logError(`Error fetching product data: ${error.message}`, error);
    }
}