import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchMarketBySlug = async (slug) => {
    if (!slug) {
        throw new Error("Slug is required");
    }
    try {
        const response = await queryCollection({
            dataCollectionId: "MarketsCollection", eq: [
                {
                    key: "slug",
                    value: `/${slug}`
                }
            ]
        });        

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items[0];
    } catch (error) {
        logError(`Error fetching markets data: ${error.message}`, error);
    }
};
