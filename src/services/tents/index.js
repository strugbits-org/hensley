import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchFeaturedProjects, fetchMatchedProducts } from "../products";
import { fetchMasterClassTenting } from "..";

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


export const fetchTentPageDetails = async () => {
    try {
        const pageDetails = await queryCollection({ dataCollectionId: "dynamicTentPageDetails" });

        if (!Array.isArray(pageDetails.items)) {
            throw new Error(`PrivacyPolicy response does not contain items array`);
        }

        return pageDetails.items[0]

    } catch (error) {
        logError(`Error fetching contact page data: ${error.message}`, error);
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
            matchedProducts,
            pageDetails,
            masterClassTentingURL
        ] = await Promise.all([
            fetchFeaturedProjects(productId),
            fetchMatchedProducts(productId),
            fetchTentPageDetails(),
            fetchMasterClassTenting()
        ]);

        return {
            productData,
            featuredProjectsData,
            matchedProducts,
            pageDetails,
            masterClassTentingURL
        };
    } catch (error) {
        logError(`Error fetching product data: ${error.message}`, error);
    }
}

export const fetchFeaturedBlogs = async (productId) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ['blogRef', 'markets', 'studios', 'author', "storeProducts"],
            ne: [
                {
                    key: "isHidden",
                    value: true
                }
            ],
            hasSome: [
                {
                    key: "storeProducts",
                    values: [productId]
                }
            ],
            sortKey: "publishDate",
            sortOrder: "desc",
        });

        if (!Array.isArray(response.items) || response.items.length === 0) {
            throw new Error(`Selected blog not found`);
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching other blogs: ${error.message}`, error);
    }
}