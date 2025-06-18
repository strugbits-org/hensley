"use server";
import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchBlogs = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ['blogRef', 'markets', 'studios', 'author', 'blogCategories'],
            sortKey: "publishDate",
            sortOrder: "desc",
            limit: "infinite",
            ne: [
                {
                    key: "isHidden",
                    value: true
                }
            ]
        });
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

export const fetchSelectedBlog = async (slug) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ['blogRef', 'markets', 'studios', 'author', "storeProducts"],
            eq: [
                {
                    key: "slug",
                    value: slug
                }
            ],
            ne: [
                {
                    key: "isHidden",
                    value: true
                }
            ]
        });

        if (!Array.isArray(response.items) || response.items.length === 0) {
            throw new Error(`Selected blog not found`);
        }

        return response.items[0];
    } catch (error) {
        logError(`Error fetching selected blog: ${error.message}`, error);
    }
}

export const fetchOtherBlogs = async (slug) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ['blogRef', 'markets', 'studios', 'author', "storeProducts"],
            ne: [
                {
                    key: "slug",
                    value: slug
                }
            ],
            ne: [
                {
                    key: "isHidden",
                    value: true
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

export const fetchPostPageData = async (slug) => {
    try {
        const [blog, otherBlogs] = await Promise.all([
            fetchSelectedBlog(slug),
            fetchOtherBlogs(slug)
        ]);
        return { blog, otherBlogs };
    } catch (error) {
        logError(`Error fetching blog page data: ${error.message}`, error);
    }
}