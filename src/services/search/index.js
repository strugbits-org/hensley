"use server";
import { logError } from "@/utils";
import {
    queryBlogs,
    queryProjects,
    queryMarkets,
    normalizePayloadBlog,
    normalizePayloadProject,
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
        const poolCoverId = "d35d73d6-63ef-c6c1-c071-2cbb88f7ffe3";
        const baseFilters = {
            dataCollectionId: "FullProductData",
            includeReferencedItems: ["product"],
            ne: [
                { key: "productSetItem", value: true },
                { key: "product", value: poolCoverId }
            ],
            limit: pageLimit,
            skip: skip,
            sortOrder: "asc",
            sortKey: "title",
            not: ["product", skipProducts]
        };

        let items = [];

        const response = await queryCollection({
            ...baseFilters,
            startsWith: [{ key: "title", value: term }]
        });

        const data = response.items?.filter(item => typeof item.product !== "string") || [];
        items = items.concat(data);
        if (items.length >= pageLimit) return items;

        const fetchProducts = async ({ searchKey, limit, excludeIds = [], searchPrefix = " ", correctionEnabled = false, searchType = "and" }) => {
            const response = await queryCollection({
                ...baseFilters,
                search: [searchKey, term],
                limit,
                searchPrefix,
                ne: [...baseFilters.ne, ...excludeIds.map(id => ({ key: "product", value: id }))],
                correctionEnabled,
                searchType
            });
            return response.items?.filter(item => typeof item.product !== "string") || [];
        };

        const searchStrategies = [
            { searchKey: "title", searchPrefix: " ", correctionEnabled: false, searchType: "and" },
            { searchKey: "title", searchPrefix: "", correctionEnabled: false, searchType: "and" },
            { searchKey: "title", searchPrefix: " ", correctionEnabled: false, searchType: "or" },
            { searchKey: "title", searchPrefix: "", correctionEnabled: false, searchType: "or" },
            { searchKey: "title", searchPrefix: " ", correctionEnabled: true, searchType: "and" },
            { searchKey: "title", searchPrefix: "", correctionEnabled: true, searchType: "and" },
            { searchKey: "title", searchPrefix: " ", correctionEnabled: true, searchType: "or" },
            { searchKey: "title", searchPrefix: "", correctionEnabled: true, searchType: "or" },
            { searchKey: "content", searchPrefix: "", correctionEnabled: false, searchType: "and" },
            { searchKey: "content", searchPrefix: "", correctionEnabled: false, searchType: "or" }
        ];

        for (const strategy of searchStrategies) {
            if (items.length >= pageLimit) break;

            const excludeIds = items.map(({ product }) => product?._id);
            const newLimit = pageLimit - items.length;
            const newItems = await fetchProducts({
                ...strategy,
                limit: newLimit,
                excludeIds
            });

            items = items.concat(newItems);

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