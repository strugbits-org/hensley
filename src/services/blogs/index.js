"use server";
import { cache } from "react";
import { logError } from "@/utils";
import {
    queryBlogs,
    queryBlogBySlug,
    queryBlogCategories,
    queryMarkets,
    queryStudios,
    querySection,
    sectionToObject,
    normalizePayloadBlog,
    normalizePayloadBlogForListing,
    normalizePayloadBlogCategory,
    normalizePayloadMarketRef,
    normalizePayloadStudio,
} from "../payloadCollections";

// Field set the listing + "other blogs" cards actually read. Excludes
// content body, storeProducts, meta, hero/gallery images.
const BLOG_LISTING_SELECT = {
    title: true,
    slug: true,
    excerpt: true,
    coverImage: true,
    author: true,
    markets: true,
    studios: true,
    blogCategories: true,
    publishedDate: true,
    createdAt: true,
    updatedAt: true,
    order: true,
    isHidden: true,
};

export const fetchBlogs = async () => {
    try {
        const payloadBlogs = await queryBlogs();
        return payloadBlogs.map(normalizePayloadBlog);
    } catch (error) {
        logError(`Error searching blogs: ${error.message}`, error);
        return [];
    }
}

// Slim listing variant. Used by /blog and by "other blogs" on /posts/[slug].
// `limit` bounds the result set — the /blog page calls without a limit to
// render the full archive, while the "other posts" slider on /posts/[slug]
// passes a small cap so the query doesn't grow with content volume.
const fetchBlogsForListing = async ({ excludeSlug, limit } = {}) => {
    try {
        const where = excludeSlug ? { slug: { not_equals: excludeSlug } } : {};
        const payloadBlogs = await queryBlogs({
            where,
            depth: 1,
            select: BLOG_LISTING_SELECT,
            ...(limit ? { limit } : {}),
        });
        return payloadBlogs.map(normalizePayloadBlogForListing);
    } catch (error) {
        logError(`Error fetching blogs for listing: ${error.message}`, error);
        return [];
    }
};

// Field set generateMetadata reads off the blog doc. Halves the per-render
// bps-core load on /posts/[slug] because Next.js runs generateMetadata and
// the page component in separate contexts that do not share React cache() —
// without this slim variant, the full depth:2 blog doc was fetched twice
// per page render (once for metadata, once for the body). The body still
// uses the full fetchSelectedBlog; only the metadata path is slimmed.
const BLOG_METADATA_SELECT = {
    title: true,
    slug: true,
    excerpt: true,
    coverImage: true,
};

export const fetchBlogMetadataBySlug = async (slug) => {
    try {
        const doc = await queryBlogBySlug(slug, {
            depth: 1,
            select: BLOG_METADATA_SELECT,
        });
        if (!doc) return null;
        return normalizePayloadBlog(doc);
    } catch (error) {
        logError(`Error fetching blog metadata: ${error.message}`, error);
        return null;
    }
};

export const fetchCategoriesMarketsAndStudios = cache(async () => {
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
});

export const fetchBlogPageData = cache(async () => {
    try {
        const [categoriesMarketStudios, blogs, pageDetails] = await Promise.all([
            fetchCategoriesMarketsAndStudios(),
            fetchBlogsForListing(),
            fetchBlogPageDetails()
        ]);
        return { categoriesMarketStudios, blogs, pageDetails };
    } catch (error) {
        logError(`Error fetching blog page data: ${error.message}`, error);
    }
});

export const fetchSelectedBlog = async (slug) => {
    try {
        const payloadBlog = await queryBlogBySlug(slug);
        if (!payloadBlog) throw new Error(`Blog not found: ${slug}`);
        return normalizePayloadBlog(payloadBlog);
    } catch (error) {
        logError(`Error fetching selected blog: ${error.message}`, error);
    }
}

// Bounded at 12 so the "other posts" slider on /posts/[slug] doesn't grow
// with archive size. Same rationale as fetchOtherProjects.
export const fetchOtherBlogs = async (slug) => {
    return fetchBlogsForListing({ excludeSlug: slug, limit: 12 });
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
    const section = await querySection("post-page-title");
    if (section) {
      const details = sectionToObject(section);
      return {
        hensleyNewsTitle: details.hensleyNewsTitle || "",
        featuredProductTitle: details.featuredProductTitle || "",
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
    const section = await querySection("blog-page-title");
    if (section) {
      const details = sectionToObject(section);
      return {
        hensleyNewsTitle: details.hensleyNewsTitle || "",
      };
    }
    return {};
  } catch (error) {
    logError(`Error fetching blog page details: ${error.message}`, error);
    return {};
  }
};