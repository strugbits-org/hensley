import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchFeaturedProjects, fetchMatchedProducts } from "../products";

export const fetchTentData = async (slug) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "TentsCollection",
            includeReferencedItems: ["tent", "productData"],
            eq: [
                {
                    key: "slug",
                    value: `/${slug}`
                }
            ],
            sortKey: "orderNumber"
        });

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items[0];
    } catch (error) {
        logError(`Error fetching tents data: ${error.message}`, error);
    }
};

export const fetchTentPageData = async (slug) => {
    try {
        const productData = await fetchTentData(slug);
        if (!productData || !productData.tent) {
            throw new Error("Product data not found");
        }
        const productId = productData.tent._id;
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
    }
}