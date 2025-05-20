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