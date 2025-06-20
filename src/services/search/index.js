"use server";
import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

const tentsCategoryId = "d27f504d-05a2-ec30-c018-cc403e815bfa";

export const searchMarkets = async (query) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "MarketsCollection",
            contains: ["title", query],
            sortKey: "order"
        });

        return response.items;
    } catch (error) {
        logError(`Error searching markets: ${error.message}`, error);
        return [];
    }
}

export const searchTents = async (query) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "FullProductData",
            includeReferencedItems: ["product"],
            contains: ["content", query],
            hasSome: [
                {
                    key: "categories",
                    values: tentsCategoryId
                }
            ],
            ne: [
                {
                    key: "productSetItem",
                    value: true
                }
            ],
        });

        return response.items;
    } catch (error) {
        logError(`Error searching tents: ${error.message}`, error);
        return [];
    }
}

export const searchBlogs = async (query) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ["blogRef", "author", "markets", "studios"],
            contains: ["titleAndDescription", query],
            sortKey: "publishDate",
            sortOrder: "desc"
        });

        return response.items;
    } catch (error) {
        logError(`Error searching blogs: ${error.message}`, error);
        return [];
    }
}

export const searchProjects = async (query) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "PortfolioCollection",
            includeReferencedItems: ["portfolioRef", "markets", "studios", "author"],
            contains: ["titleAndDescription", query],
            sortKey: "order",
            ne: [
                {
                    key: "isHidden",
                    value: true
                }
            ]
        });

        return response.items;
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
  try {
    const searchData = await queryCollection({ dataCollectionId: "searchPageDetails" });

    if (!Array.isArray(searchData.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return {
      searchPageDetails: searchData.items[0],
    };

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};




export const searchOtherData = async (query) => {
    const [tents, projects, blogs, searchPageDetails] = await Promise.all([
        searchTents(query),
        searchProjects(query),
        searchBlogs(query),

    ]);

    return { tents, projects, blogs, searchPageDetails };
}