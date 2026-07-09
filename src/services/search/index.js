"use server";
import { logError } from "@/utils";
import {
    normalizePayloadBlogForListing,
    normalizePayloadProjectForListing,
    querySection,
    sectionToObject,
    queryStorefrontSearch,
} from "../payloadCollections";
import { normalizeCoreMarketItem } from "..";
import { cache } from "react";

// Search now runs entirely in bps-core: a single ranked Postgres full-text
// query (ts_rank + pg_trgm fuzzy fallback) per bucket via the
// /api/storefront-search endpoint, scoped to the Hensley channel. These
// wrappers keep the previous return shapes so the sectioned UI is unchanged;
// each maps the endpoint's populated `doc` through the existing normalizers.

const idOf = (doc) => doc?.id || doc?._id || "";

export const searchMarkets = async (query) => {
    try {
        const { results } = await queryStorefrontSearch({ q: query, buckets: ["markets"], limit: 50 });
        // normalizeCoreMarketItem is exported from a "use server" module, so the
        // cross-file import is an async server-action stub — must await it.
        // Spreading the Promise produced `{ category: "" }` and blank market cards.
        const markets = [];
        for (const hit of results.markets) {
            if (!hit?.doc) continue;
            const market = await normalizeCoreMarketItem(hit.doc);
            markets.push({
                ...market,
                category: market.title || market.category || "",
            });
        }
        return markets;
    } catch (error) {
        logError(`Error searching markets: ${error.message}`, error);
        return [];
    }
};

export const searchTents = async (query) => {
    try {
        const { results } = await queryStorefrontSearch({ q: query, buckets: ["tents"], limit: 100 });
        return results.tents
            .map((hit) => hit.doc)
            .filter(Boolean)
            .map((p) => ({
                product: {
                    _id: idOf(p),
                    slug: p.slug || "",
                    mainMedia: p.mainMedia,
                    name: p.title || p.name || "",
                    additionalInfoSections: p.additionalInfoSections || [],
                },
            }));
    } catch (error) {
        logError(`Error searching tents: ${error.message}`, error);
        return [];
    }
};

export const searchBlogs = async (query) => {
    try {
        const { results } = await queryStorefrontSearch({ q: query, buckets: ["blogs"], limit: 100 });
        return results.blogs.map((hit) => hit.doc).filter(Boolean).map(normalizePayloadBlogForListing);
    } catch (error) {
        logError(`Error searching blogs: ${error.message}`, error);
        return [];
    }
};

export const searchProjects = async (query) => {
    try {
        const { results } = await queryStorefrontSearch({ q: query, buckets: ["projects"], limit: 100 });
        return results.projects.map((hit) => hit.doc).filter(Boolean).map(normalizePayloadProjectForListing);
    } catch (error) {
        logError(`Error searching projects: ${error.message}`, error);
        return [];
    }
};

// Products bucket only (tents are their own bucket, so no double-appearance).
// Supports the RelatedProducts load-more via skip → page. `skipProducts` guards
// against any overlap across pages.
export const searchProducts = async ({ term, pageLimit = 1000, skip = 0, skipProducts = [] }) => {
    try {
        const page = skip > 0 ? Math.floor(skip / pageLimit) + 1 : 1;
        const { results } = await queryStorefrontSearch({
            q: term,
            buckets: ["products"],
            limit: pageLimit,
            page,
        });

        const seen = new Set(skipProducts);
        const items = [];
        for (const hit of results.products) {
            const doc = hit.doc;
            const id = idOf(doc) || hit.docId;
            if (!id || seen.has(id)) continue;
            seen.add(id);
            items.push({
                product: {
                    ...doc,
                    _id: id,
                    name: doc?.name || doc?.title || "",
                },
                slug: doc?.slug || hit.slug || "",
                title: doc?.title || hit.title || "",
            });
            if (items.length >= pageLimit) break;
        }
        return items;
    } catch (error) {
        logError("Error searching products:", error);
        return [];
    }
};

export const fetchSearchPageDetails = cache(async () => {
    try {
        const section = await querySection('search-page-details');
        if (section) {
            return sectionToObject(section);
        }
    } catch (error) {
        logError('Error fetching search page details:', error);
    }
    return {
        relatedPostTitle: "RELATED POSTS",
        tentsTypeTitle: "TYPES OF TENTS",
        ourMarketsTitle: "OUR MARKETS",
        relatedProductTitle: "PRODUCTS RELATED TO YOUR SEARCH",
        relatedProjectTitle: "RELATED PROJECTS",
    };
});

// Tents, projects and blogs in a single ranked endpoint call (was three
// separate fan-out queries). The previously dead `searchPageDetails` entry —
// destructured but never fetched, so always undefined — has been removed;
// section titles come from fetchSearchPageDetails via the page props.
export const searchOtherData = async (query) => {
    try {
        const { results } = await queryStorefrontSearch({
            q: query,
            buckets: ["tents", "projects", "blogs"],
            limit: 100,
        });
        return {
            tents: results.tents
                .map((hit) => hit.doc)
                .filter(Boolean)
                .map((p) => ({
                    product: {
                        _id: idOf(p),
                        slug: p.slug || "",
                        mainMedia: p.mainMedia,
                        name: p.title || p.name || "",
                        additionalInfoSections: p.additionalInfoSections || [],
                    },
                })),
            projects: results.projects.map((hit) => hit.doc).filter(Boolean).map(normalizePayloadProjectForListing),
            blogs: results.blogs.map((hit) => hit.doc).filter(Boolean).map(normalizePayloadBlogForListing),
        };
    } catch (error) {
        logError(`Error searching other data: ${error.message}`, error);
        return { tents: [], projects: [], blogs: [] };
    }
};
