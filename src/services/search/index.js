"use server";
import { logError } from "@/utils";
import {
    queryBlogs,
    queryProjects,
    queryMarkets,
    normalizePayloadBlog,
    normalizePayloadProject,
    queryProductsFromPayload,
} from "../payloadCollections";
export const searchMarkets = async (query) => {
    try {
        const payloadMarkets = await queryMarkets();
        const q = query.toLowerCase();
        return payloadMarkets
            .filter((m) => (m.title || "").toLowerCase().includes(q))
            .map((m) => ({
                ...m,
                _id: m.id || m._id,
                category: m.title || m.category || "",
                slug: m.slug?.startsWith("/") ? m.slug : `/${m.slug || ""}`,
            }));
    } catch (error) {
        logError(`Error searching markets: ${error.message}`, error);
        return [];
    }
}

export const searchTents = async (query) => {
    try {
        const { fetchAllTents } = await import("../tents");
        const tents = await fetchAllTents();
        if (!tents?.length) return [];
        const q = query.toLowerCase();
        return tents
            .filter(t =>
                (t.title || t.tent?.name || "").toLowerCase().includes(q) ||
                (t.tent?.description || "").toLowerCase().includes(q)
            )
            .map(t => ({
                product: {
                    _id: t.id || t._id,
                    slug: t.slug || t.tent?.slug || "",
                    mainMedia: t.tent?.mainMedia,
                    name: t.tent?.name || t.title || "",
                    additionalInfoSections: t.tent?.additionalInfoSections || [],
                },
            }));
    } catch (error) {
        logError(`Error searching tents: ${error.message}`, error);
        return [];
    }
};

export const searchBlogs = async (query) => {
    try {
        const payloadBlogs = await queryBlogs({
            where: {
                or: [
                    { title: { like: query } },
                    { excerpt: { like: query } },
                ],
            },
            sort: "-publishDate",
        });
        return payloadBlogs.map(normalizePayloadBlog);
    } catch (error) {
        logError(`Error searching blogs: ${error.message}`, error);
        return [];
    }
}

export const searchProjects = async (query) => {
    try {
        const payloadProjects = await queryProjects({
            where: {
                or: [
                    { title: { like: query } },
                    { description: { like: query } },
                ],
            },
            sort: "order",
        });
        return payloadProjects.map(normalizePayloadProject);
    } catch (error) {
        logError(`Error searching projects: ${error.message}`, error);
        return [];
    }
}

export const searchProducts = async ({ term, pageLimit = 1000, skip = 0, skipProducts = [] }) => {
    try {
        if (!term || !term.trim()) return [];
        const t = term.trim();

        const [byTitle, bySlug] = await Promise.all([
            queryProductsFromPayload({ where: { title: { like: t } }, limit: pageLimit, skip, depth: 1 }),
            queryProductsFromPayload({ where: { slug: { like: t } }, limit: Math.min(pageLimit, 50), depth: 1 }),
        ]);

        const seen = new Set(skipProducts);
        const items = [];

        for (const doc of [...byTitle.docs, ...bySlug.docs]) {
            const id = doc.id || doc._id;
            if (!id || seen.has(id)) continue;
            seen.add(id);
            items.push({ product: doc, slug: doc.slug, title: doc.title });
            if (items.length >= pageLimit) break;
        }

        return items;
    } catch (error) {
        logError("Error searching products:", error);
        return [];
    }
};


export const fetchSearchPageDetails = async () => {
  return {
    searchPageDetails: {
      relatedPostTitle: "Related Posts",
      tentsTypeTitle: "Types of Tents",
      ourMarketsTitle: "Our Markets",
      relatedProductTitle: "Related Products",
      relatedProjectTitle: "Related Projects",
    },
  };
};




export const searchOtherData = async (query) => {
    const [tents, projects, blogs, searchPageDetails] = await Promise.all([
        searchTents(query),
        searchProjects(query),
        searchBlogs(query),

    ]);

    return { tents, projects, blogs, searchPageDetails };
}