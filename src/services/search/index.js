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
            ]
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
            includeReferencedItems: ["portfolioRef", "markets", "studios"],
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

export const searchData = async (query) => {
    const [markets, tents, projects, blogs] = await Promise.all([
        searchMarkets(query),
        searchTents(query),
        searchProjects(query),
        searchBlogs(query)
    ]);

    return { markets, tents, projects, blogs };
}