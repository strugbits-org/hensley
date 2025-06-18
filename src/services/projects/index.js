"use server";
import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchProjects = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "PortfolioCollection",
            includeReferencedItems: ['portfolioRef', 'markets', 'studios', 'portfolioCategories'],
            sortKey: "order",
            limit: "infinite",
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

export const fetchCategoriesMarketsAndStudios = async () => {
    try {
        const [categories, markets, studios] = await Promise.all([
            queryCollection({ dataCollectionId: "Portfolio/Collections", limit: "infinite" }),
            queryCollection({ dataCollectionId: "Markets", limit: "infinite" }),
            queryCollection({ dataCollectionId: "Studios", limit: "infinite" })
        ]);
        return { categories: categories.items, markets: markets.items, studios: studios.items };
    } catch (error) {
        logError(`Error fetching categories, markets, and studios: ${error.message}`, error);
        return {
            categories: [],
            markets: [],
            studios: []
        };
    }
}

export const fetchPortfolioPageData = async () => {
    try {
        const [categoriesMarketStudios, projects] = await Promise.all([
            fetchCategoriesMarketsAndStudios(),
            fetchProjects()
        ]);
        return { categoriesMarketStudios, projects };
    } catch (error) {
        logError(`Error fetching projects page data: ${error.message}`, error);
    }
}

export const fetchSelectedProject = async (slug) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "PortfolioCollection",
            includeReferencedItems: ['portfolioRef', 'markets', 'studios', "storeProducts"],
            eq: [
                {
                    key: "slug",
                    value: slug
                }
            ],
            ne: [
                {
                    key: "isHidden",
                    value: true
                }
            ]
        });

        if (!Array.isArray(response.items) || response.items.length === 0) {
            throw new Error(`Selected project not found`);
        }

        return response.items[0];
    } catch (error) {
        logError(`Error fetching selected projects=: ${error.message}`, error);
    }
}

export const fetchOtherProjects = async (slug) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "PortfolioCollection",
            includeReferencedItems: ['portfolioRef', 'markets', 'studios', "storeProducts"],
            ne: [
                {
                    key: "slug",
                    value: slug
                }
            ],
            ne: [
                {
                    key: "isHidden",
                    value: true
                }
            ],
            sortKey: "order",
        });

        if (!Array.isArray(response.items) || response.items.length === 0) {
            throw new Error(`Selected projects not found`);
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching other projects: ${error.message}`, error);
    }
}

export const fetchProjectPageData = async (slug) => {
    try {
        const [project, otherProjects] = await Promise.all([
            fetchSelectedProject(slug),
            fetchOtherProjects(slug)
        ]);
        return { project, otherProjects };
    } catch (error) {
        logError(`Error fetching project page data: ${error.message}`, error);
    }
}