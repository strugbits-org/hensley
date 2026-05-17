"use server";
import { logError } from "@/utils";
import {
    queryBlogs,
    queryProjects,
    normalizePayloadBlog,
    normalizePayloadProject,
    queryProductsFromPayload,
    querySection,
    sectionToObject,
} from "../payloadCollections";
import { fetchMarketsData } from "..";
import { cache } from "react";

// Split a user query into non-empty lowercased tokens. Used to AND across
// words ("wedding tent" → must match both "wedding" AND "tent" anywhere in
// the searched fields). Payload's `like` operator on a multi-word string
// matches the literal phrase only, so without tokenizing "wedding tent" misses
// any product titled "tent for weddings".
const tokenize = (query) => (query || "").trim().toLowerCase().split(/\s+/).filter(Boolean);

// Build a Payload `where` clause that requires every token to match at least
// one of `fields` (case-insensitive). Resulting shape:
//   { and: [ { or: [{ f1: { like: tok1 } }, { f2: { like: tok1 } }] }, ... ] }
// Payload's `like` on Postgres is case-insensitive (ILIKE under the hood) and
// on Mongo uses a regex with the `i` flag — so `like` is the portable choice.
const buildTokenWhere = (tokens, fields) => ({
    and: tokens.map((tok) => ({
        or: fields.map((f) => ({ [f]: { like: tok } })),
    })),
});

export const searchMarkets = async (query) => {
    try {
        const markets = await fetchMarketsData();
        const tokens = tokenize(query);
        if (!tokens.length) return [];
        return markets
            .filter((m) => {
                const haystack = [m.title, m.tagline, m.description]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
                return tokens.every((tok) => haystack.includes(tok));
            })
            .map((m) => ({
                ...m,
                category: m.title || m.category || "",
            }));
    } catch (error) {
        logError(`Error searching markets: ${error.message}`, error);
        return [];
    }
}

// Tents are products with type === 'tent'. Querying the products collection
// directly (instead of fetching all tents and filtering in memory) is faster
// and respects the same multi-word AND semantics as the products bucket.
// NOTE: products.description is stored as jsonb (richText) — Postgres ILIKE
// doesn't work on jsonb, so we restrict the text match to `title` only.
export const searchTents = async (query) => {
    try {
        const tokens = tokenize(query);
        if (!tokens.length) return [];

        const where = {
            and: [
                { type: { equals: "tent" } },
                { visible: { equals: true } },
                { status: { equals: "active" } },
                ...buildTokenWhere(tokens, ["title"]).and,
            ],
        };

        const { docs } = await queryProductsFromPayload({ where, depth: 1, limit: 100 });

        return docs.map((p) => ({
            product: {
                _id: p.id || p._id,
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
        const tokens = tokenize(query);
        if (!tokens.length) return [];
        const payloadBlogs = await queryBlogs({
            where: buildTokenWhere(tokens, ["title", "excerpt"]),
        });
        return payloadBlogs.map(normalizePayloadBlog);
    } catch (error) {
        logError(`Error searching blogs: ${error.message}`, error);
        return [];
    }
}

// NOTE: projects.description is richText (jsonb) — Postgres ILIKE fails on
// jsonb. Use the plain-text `excerpt` field instead (text in bps-core).
export const searchProjects = async (query) => {
    try {
        const tokens = tokenize(query);
        if (!tokens.length) return [];
        const payloadProjects = await queryProjects({
            where: buildTokenWhere(tokens, ["title", "excerpt"]),
            sort: "order",
        });
        return payloadProjects.map(normalizePayloadProject);
    } catch (error) {
        logError(`Error searching projects: ${error.message}`, error);
        return [];
    }
}

// Products: AND across tokens, fan out across title / slug.
// Tents are excluded so they don't double-appear in both the products and the
// tents bucket.
// NOTE: products.description is stored as jsonb (richText) — Postgres ILIKE
// fails on jsonb (`operator does not exist: jsonb ~~* unknown`). Until we have
// a denormalized plain-text searchable field, description fallback is off.
export const searchProducts = async ({ term, pageLimit = 1000, skip = 0, skipProducts = [] }) => {
    try {
        const tokens = tokenize(term);
        if (!tokens.length) return [];

        const excludeTent = { type: { not_equals: "tent" } };

        const wherePlus = (fields) => ({
            and: [excludeTent, ...buildTokenWhere(tokens, fields).and],
        });

        const [byTitle, bySlug] = await Promise.all([
            queryProductsFromPayload({ where: wherePlus(["title"]), limit: pageLimit, skip, depth: 1 }),
            queryProductsFromPayload({ where: wherePlus(["slug"]), limit: Math.min(pageLimit, 50), depth: 1 }),
        ]);

        const seen = new Set(skipProducts);
        const items = [];

        for (const doc of [...byTitle.docs, ...bySlug.docs]) {
            const id = doc.id || doc._id;
            if (!id || seen.has(id)) continue;
            seen.add(id);
            items.push({
                product: {
                    ...doc,
                    _id: id,
                    name: doc.name || doc.title || "",
                },
                slug: doc.slug,
                title: doc.title,
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
    logError('Error fetching home page details:', error);
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
    const [tents, projects, blogs, searchPageDetails] = await Promise.all([
        searchTents(query),
        searchProjects(query),
        searchBlogs(query),

    ]);

    return { tents, projects, blogs, searchPageDetails };
}