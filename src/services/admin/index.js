"use server";
import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

// const baseUrl = process.env.BASE_URL;

export const fetchProductSetsData = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "MultipleProductsSet",
            includeReferencedItems: ["product", "products"],
            limit: "infinite",
        });

        if (!response || !response.items) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items.filter(item => typeof item.product !== "string" && item.product);

    } catch (error) {
        logError(`Error fetching product collection data: ${error.message}`, error);
        return [];
    }
}