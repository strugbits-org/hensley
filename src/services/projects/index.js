"use server";
import { logError } from "@/utils";
import { fetchMarketsData } from "..";
import {
    queryProjects,
    queryProjectBySlug,
    queryProjectCategories,
    queryMarkets,
    queryStudios,
    normalizePayloadProject,
    normalizePayloadProjectCategory,
    normalizePayloadStudio,
    queryPageBySlug,
} from "../payloadCollections";

const normalizePayloadMarketForFilter = (m) => {
    if (!m || typeof m !== "object") return m;
    return {
        ...m,
        _id: m.id || m._id,
        category: m.title || m.category || "",
        slug: m.slug?.startsWith("/") ? m.slug : `/${m.slug || ""}`,
    };
};

export const fetchProjects = async () => {
    try {
        const payloadProjects = await queryProjects({ sort: "order" });
        return payloadProjects.map(normalizePayloadProject);
    } catch (error) {
        logError(`Error searching projects: ${error.message}`, error);
        return [];
    }
}

export const fetchCategoriesMarketsAndStudios = async () => {
    try {
        const [payloadCategories, payloadMarkets, payloadStudios] = await Promise.all([
            queryProjectCategories(),
            queryMarkets(),
            queryStudios(),
        ]);
        return {
            categories: payloadCategories.map(normalizePayloadProjectCategory),
            markets: payloadMarkets.map(normalizePayloadMarketForFilter),
            studios: payloadStudios.map(normalizePayloadStudio),
        };
    } catch (error) {
        logError(`Error fetching categories, markets, and studios: ${error.message}`, error);
        return { categories: [], markets: [], studios: [] };
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

export const fetchSelectedProject = async (slug, { draft = false } = {}) => {
    try {
        const payloadProject = await queryProjectBySlug(slug, { draft });
        if (!payloadProject) throw new Error(`Selected project not found`);
        return normalizePayloadProject(payloadProject);
    } catch (error) {
        logError(`Error fetching selected projects=: ${error.message}`, error);
    }
}

export const fetchOtherProjects = async (slug) => {
    try {
        const payloadProjects = await queryProjects({
            where: { slug: { not_equals: slug } },
            sort: "order",
        });
        return payloadProjects.map(normalizePayloadProject);
    } catch (error) {
        logError(`Error fetching other projects: ${error.message}`, error);
        return [];
    }
}

export const fetchProjectPageData = async (slug, { draft = false } = {}) => {
    try {
        const [project, otherProjects, pageDetails] = await Promise.all([
            fetchSelectedProject(slug, { draft }),
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
    const page = await queryPageBySlug('project');
    if (page) {
      const blocks = page.layout || page.blocks || [];
      const customSection = blocks.find(b => b.blockType === 'customSection') || blocks[0] || page;
      return { hensleyNewsTitle: customSection.hensleyNewsTitle || page.hensleyNewsTitle || '' };
    }
    return {};
  } catch (error) {
    logError(`Error fetching project page details: ${error.message}`, error);
    return {};
  }
};

export const fetchFeaturedProjects = async (limit = 3) => {
    try {
        const payloadProjects = await queryProjects({
            where: { isFeatured: { equals: true } },
            sort: "order",
            limit,
        });
        if (payloadProjects.length) {
            return payloadProjects.map(normalizePayloadProject);
        }
        // Fallback: return first N projects
        const fallback = await queryProjects({ sort: "order", limit });
        return fallback.map(normalizePayloadProject);
    } catch (error) {
        logError(`Error fetching featured projects: ${error.message}`, error);
        return [];
    }
};