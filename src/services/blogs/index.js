"use server";
import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
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
        // Payload-first
        const payloadBlogs = await queryBlogs({ sort: "-publishedDate" });
        if (payloadBlogs.length) {
            return payloadBlogs.map(normalizePayloadBlog);
        }

        // Wix fallback
        const response = await queryCollection({
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ['blogRef', 'markets', 'studios', 'author', 'blogCategories'],
            sortKey: "publishDate",
            sortOrder: "desc",
            limit: "infinite",
            ne: [{ key: "isHidden", value: true }]
        });
        return response.items;
    } catch (error) {
        logError(`Error searching blogs: ${error.message}`, error);
        return [];
    }
}

export const fetchCategoriesMarketsAndStudios = async () => {
    try {
        // Payload-first
        const [payloadCategories, payloadMarkets, payloadStudios] = await Promise.all([
            queryBlogCategories(),
            queryMarkets(),
            queryStudios(),
        ]);
        if (payloadCategories.length || payloadMarkets.length || payloadStudios.length) {
            return {
                categories: payloadCategories.map(normalizePayloadBlogCategory),
                markets: payloadMarkets.map((m) => normalizePayloadMarketRef(m)),
                studios: payloadStudios.map(normalizePayloadStudio),
            };
        }

        // Wix fallback
        const [categories, markets, studios] = await Promise.all([
            queryCollection({ dataCollectionId: "Blog/Categories", limit: "infinite" }),
            queryCollection({ dataCollectionId: "Markets", limit: "infinite" }),
            queryCollection({ dataCollectionId: "Studios", limit: "infinite" })
        ]);
        return { categories: categories.items, markets: markets.items, studios: studios.items };
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
        // Payload-first
        const payloadBlog = await queryBlogBySlug(slug);
        if (payloadBlog) {
            return normalizePayloadBlog(payloadBlog);
        }

        // Wix fallback
        const response = await queryCollection({
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ['blogRef', 'markets', 'studios', 'author', "storeProducts"],
            eq: [{ key: "slug", value: slug }],
            ne: [{ key: "isHidden", value: true }]
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
        // Payload-first
        const payloadBlogs = await queryBlogs({
            where: { slug: { not_equals: slug } },
            sort: "-publishedDate",
        });
        if (payloadBlogs.length) {
            return payloadBlogs.map(normalizePayloadBlog);
        }

        // Wix fallback
        const response = await queryCollection({
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ['blogRef', 'markets', 'studios', 'author', "storeProducts"],
            ne: [
                { key: "slug", value: slug },
                { key: "isHidden", value: true }
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
    // Payload-first: query the "post" page and extract the custom-section block
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

    // Wix fallback
    const pageDetails = await queryCollection({ dataCollectionId: "PostPageTitle" });

    if (!Array.isArray(pageDetails.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return pageDetails.items[0]

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};


export const fetchBlogPageDetails = async () => {
  try {
    // Payload-first: query the "blog" page and extract the custom-section block
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

    // Wix fallback
    const pageDetails = await queryCollection({ dataCollectionId: "BlogPageTitle" });

    if (!Array.isArray(pageDetails.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return pageDetails.items[0]

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};