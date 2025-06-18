"use server";
import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchBlogs = async () => {
    try {
        const payload = {
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ['blogRef', 'markets', 'studios', 'author', 'blogCategories'],
            sortKey: "publishDate",
            sortOrder: "desc",
            limit: "infinite"
        };
        const response = await queryCollection(payload);
        return response.items;
    } catch (error) {
        logError(`Error searching blogs: ${error.message}`, error);
        return [];
    }
}

export const fetchCategoriesMarketsAndStudios = async () => {
    try {
        const [categories, markets, studios] = await Promise.all([
            queryCollection({ dataCollectionId: "Blog/Categories", limit: "infinite" }),
            queryCollection({ dataCollectionId: "Markets", limit: "infinite" }),
            queryCollection({ dataCollectionId: "Studios", limit: "infinite" })
        ]);
        return { categories: categories.items, markets: markets.items, studios: studios.items };
    } catch (error) {
        logError(`Error fetching categories, markets, and studios: ${error.message}`, error);
        return {
            categories: [],
            markets: [],
            studios: []
        };
    }
}


export const fetchBlogPageData = async () => {
    try {
        const [categoriesMarketStudios, blogs] = await Promise.all([
            fetchCategoriesMarketsAndStudios(),
            fetchBlogs({ limit: 13, skip: 0 })
        ]);
        return { categoriesMarketStudios, blogs };
    } catch (error) {
        logError(`Error fetching blog page data: ${error.message}`, error);
    }
}