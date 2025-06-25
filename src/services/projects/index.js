"use server";
import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchMarketsData } from "..";

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
        const [categoriesMarketStudios, projects, markets] = await Promise.all([
            fetchCategoriesMarketsAndStudios(),
            fetchProjects(),
            fetchMarketsData()
        ]);
        return { categoriesMarketStudios, projects, markets };
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
                },
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
        const [project, otherProjects, pageDetails] = await Promise.all([
            fetchSelectedProject(slug),
            fetchOtherProjects(slug),
            fetchProjectPageDetails()
        ]);
        return { project, otherProjects, pageDetails };
    } catch (error) {
        logError(`Error fetching project page data: ${error.message}`, error);
    }
}

export const fetchProjectPageDetails = async () => {
  try {
    const pageDetails = await queryCollection({ dataCollectionId: "ProjectPageTitle" });

    if (!Array.isArray(pageDetails.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return pageDetails.items[0]

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};