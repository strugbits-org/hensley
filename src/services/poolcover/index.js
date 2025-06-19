import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchFeaturedProjects, fetchMatchedProducts } from "../products";

const baseUrl = process.env.BASE_URL;

export const fetchPoolCovers = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "PoolCovers",
            includeReferencedItems: ["covers", "productData"],
        });

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching covers data: ${error.message}`, error);
    }
};

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
export const uploadRelevantImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${baseUrl}/api/media/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        logError(`Error uploading image: ${error.message}`, error);
        throw error;
    }
}