"use server";
import { logError } from "@/utils";
import {
    queryBlogs,
    queryBlogBySlug,
    queryBlogCategories,
    queryMarkets,
    queryStudios,
    queryPageBySlug,
    normalizePayloadBlog,
    normalizePayloadBlogCategory,
    normalizePayloadMarketRef,
    normalizePayloadStudio,
} from "../payloadCollections";

export const fetchBlogs = async () => {
    try {
        const payloadBlogs = await queryBlogs({ sort: "-publishedDate" });
        return payloadBlogs.map(normalizePayloadBlog);
    } catch (error) {
        logError(`Error searching blogs: ${error.message}`, error);
        return [];
    }
}

export const fetchCategoriesMarketsAndStudios = async () => {
    try {
        const [payloadCategories, payloadMarkets, payloadStudios] = await Promise.all([
            queryBlogCategories(),
            queryMarkets(),
            queryStudios(),
        ]);
        return {
            categories: payloadCategories.map(normalizePayloadBlogCategory),
            markets: payloadMarkets.map((m) => normalizePayloadMarketRef(m)),
            studios: payloadStudios.map(normalizePayloadStudio),
        };
    } catch (error) {
        logError(`Error fetching categories, markets, and studios: ${error.message}`, error);
        return { categories: [], markets: [], studios: [] };
    }
}

export const fetchBlogPageData = async () => {
    try {
        const [categoriesMarketStudios, blogs, pageDetails] = await Promise.all([
            fetchCategoriesMarketsAndStudios(),
            fetchBlogs(),
            fetchBlogPageDetails()
        ]);
        return { categoriesMarketStudios, blogs, pageDetails };
    } catch (error) {
        logError(`Error fetching blog page data: ${error.message}`, error);
    }
}

export const fetchSelectedBlog = async (slug) => {
    try {
        const payloadBlog = await queryBlogBySlug(slug);
        if (!payloadBlog) throw new Error(`Blog not found: ${slug}`);
        return normalizePayloadBlog(payloadBlog);
    } catch (error) {
        logError(`Error fetching selected blog: ${error.message}`, error);
    }
}

export const fetchOtherBlogs = async (slug) => {
    try {
        const payloadBlogs = await queryBlogs({
            where: { slug: { not_equals: slug } },
            sort: "-publishedDate",
        });
        return payloadBlogs.map(normalizePayloadBlog);
    } catch (error) {
        logError(`Error fetching other blogs: ${error.message}`, error);
        return [];
    }
}

export const fetchPostPageData = async (slug) => {
    try {
        const [blog, otherBlogs, pageDetails] = await Promise.all([
            fetchSelectedBlog(slug),
            fetchOtherBlogs(slug),
            fetchPostPageDetails()
        ]);
        return { blog, otherBlogs, pageDetails };
    } catch (error) {
        logError(`Error fetching blog page data: ${error.message}`, error);
    }
}

export const fetchPostPageDetails = async () => {
  try {
    const page = await queryPageBySlug("post");
    if (page) {
      const blocks = page.layout || page.blocks || [];
      const customSection = blocks.find(
        (b) => b.blockType === "customSection" || b.blockName === "post-listing"
      ) || blocks[0] || page;
      return {
        hensleyNewsTitle: customSection.hensleyNewsTitle || page.hensleyNewsTitle || "",
        featuredProductTitle: customSection.featuredProductTitle || page.featuredProductTitle || "",
      };
    }
    return {};
  } catch (error) {
    logError(`Error fetching post page details: ${error.message}`, error);
    return {};
  }
};


export const fetchBlogPageDetails = async () => {
  try {
    const page = await queryPageBySlug("blog");
    if (page) {
      const blocks = page.layout || page.blocks || [];
      const customSection = blocks.find(
        (b) => b.blockType === "customSection" || b.blockName === "blog-listing"
      ) || blocks[0] || page;
      return {
        hensleyNewsTitle: customSection.hensleyNewsTitle || page.hensleyNewsTitle || "",
      };
    }
    return {};
  } catch (error) {
    logError(`Error fetching blog page details: ${error.message}`, error);
    return {};
  }
};