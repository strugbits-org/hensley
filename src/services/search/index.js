"use server";
import { logError } from "@/utils";
import {
    normalizePayloadBlogForListing,
    normalizePayloadProjectForListing,
    querySection,
    sectionToObject,
    queryStorefrontSearch,
} from "../payloadCollections";
import { normalizeCoreMarketItem } from "../normalizeCoreMarket";
import { cache } from "react";

const idOf = (doc) => doc?.id || doc?._id || "";

const mapTentHit = (p) => ({
    product: {
        _id: idOf(p),
        slug: p.slug || "",
        mainMedia: p.mainMedia,
        name: p.title || p.name || "",
        additionalInfoSections: p.additionalInfoSections || [],
    },
});

const mapProductHits = (hits, { pageLimit, skipProducts = [] } = {}) => {
    const seen = new Set(skipProducts);
    const items = [];
    for (const hit of hits) {
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
        if (pageLimit != null && items.length >= pageLimit) break;
    }
    return items;
};

const mapMarketHits = (hits) =>
    hits
        .filter((hit) => hit?.doc)
        .map((hit) => {
            const market = normalizeCoreMarketItem(hit.doc);
            return {
                ...market,
                category: market.title || market.category || "",
            };
        });

export const searchAll = async (query, { productLimit = 24, otherLimit = 50 } = {}) => {
    const empty = { markets: [], products: [], tents: [], projects: [], blogs: [] };
    try {
        const limit = Math.max(productLimit, otherLimit);
        const { results } = await queryStorefrontSearch({
            q: query,
            buckets: ["products", "tents", "blogs", "projects", "markets"],
            limit,
        });
        return {
            markets: mapMarketHits(results.markets.slice(0, otherLimit)),
            products: mapProductHits(results.products, { pageLimit: productLimit }),
            tents: results.tents
                .slice(0, otherLimit)
                .map((hit) => hit.doc)
                .filter(Boolean)
                .map(mapTentHit),
            projects: results.projects
                .slice(0, otherLimit)
                .map((hit) => hit.doc)
                .filter(Boolean)
                .map(normalizePayloadProjectForListing),
            blogs: results.blogs
                .slice(0, otherLimit)
                .map((hit) => hit.doc)
                .filter(Boolean)
                .map(normalizePayloadBlogForListing),
        };
    } catch (error) {
        logError(`Error searching all: ${error.message}`, error);
        return empty;
    }
};

export const searchMarkets = async (query) => {
    try {
        const { results } = await queryStorefrontSearch({ q: query, buckets: ["markets"], limit: 50 });
        return mapMarketHits(results.markets);
    } catch (error) {
        logError(`Error searching markets: ${error.message}`, error);
        return [];
    }
};

export const searchTents = async (query) => {
    try {
        const { results } = await queryStorefrontSearch({ q: query, buckets: ["tents"], limit: 100 });
        return results.tents.map((hit) => hit.doc).filter(Boolean).map(mapTentHit);
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

export const searchProducts = async ({ term, pageLimit = 1000, skip = 0, skipProducts = [] }) => {
    try {
        const page = skip > 0 ? Math.floor(skip / pageLimit) + 1 : 1;
        const { results } = await queryStorefrontSearch({
            q: term,
            buckets: ["products"],
            limit: pageLimit,
            page,
        });
        return mapProductHits(results.products, { pageLimit, skipProducts });
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

export const searchOtherData = async (query) => {
    try {
        const { results } = await queryStorefrontSearch({
            q: query,
            buckets: ["tents", "projects", "blogs"],
            limit: 100,
        });
        return {
            tents: results.tents.map((hit) => hit.doc).filter(Boolean).map(mapTentHit),
            projects: results.projects.map((hit) => hit.doc).filter(Boolean).map(normalizePayloadProjectForListing),
            blogs: results.blogs.map((hit) => hit.doc).filter(Boolean).map(normalizePayloadBlogForListing),
        };
    } catch (error) {
        logError(`Error searching other data: ${error.message}`, error);
        return { tents: [], projects: [], blogs: [] };
    }
};
