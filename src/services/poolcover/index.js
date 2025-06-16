import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchFeaturedProjects, fetchMatchedProducts } from "../products";

export const fetchPoolCoverData = async (slug) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "PoolCovers",
            includeReferencedItems: ["covers", "productData"],
            eq: [
                {
                    key: "slug",
                    value: slug
                }
            ],
            sortKey: "order"
        });

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items[0];
    } catch (error) {
        logError(`Error fetching covers data: ${error.message}`, error);
    }
};

export const fetchPoolCoverPageData = async (slug) => {
    try {
        const productData = await fetchPoolCoverData(slug);

        if (!productData || !productData.covers) {
            throw new Error("Product data not found");
        }
        const productId = productData.covers._id;
        const [
            featuredProjectsData,
            matchedProducts
        ] = await Promise.all([
            fetchFeaturedProjects(productId),
            fetchMatchedProducts(productId)
        ]);

        return {
            productData,
            featuredProjectsData,
            matchedProducts
        };
    } catch (error) {
        logError(`Error fetching product data: ${error.message}`, error);
        throw error;
    }
}