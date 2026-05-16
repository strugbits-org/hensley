"use server";
import { cache } from "react";
import { logError } from "@/utils";
import { fetchMarketsData } from "..";
import {
    queryProjects,
    queryProjectBySlug,
    queryProjectCategories,
    queryMarkets,
    queryStudios,
    normalizePayloadProject,
    normalizePayloadProjectForListing,
    normalizePayloadProjectCategory,
    normalizePayloadMarketRef,
    normalizePayloadStudio,
    querySection,
    sectionToObject,
} from "../payloadCollections";

// Field set the projects listing + "other projects" cards actually read.
// Excludes hero, gallery, testimonial, storeProducts, meta.
const PROJECT_LISTING_SELECT = {
    title: true,
    slug: true,
    description: true,
    coverImage: true,
    publishDate: true,
    publishedDate: true,
    order: true,
    isHidden: true,
    markets: true,
    studios: true,
    portfolioCategories: true,
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

// Slim listing variant. Used by /projects and by "other projects" on /project/[slug].
const fetchProjectsForListing = async ({ excludeSlug } = {}) => {
    try {
        const where = excludeSlug ? { slug: { not_equals: excludeSlug } } : {};
        const payloadProjects = await queryProjects({
            where,
            sort: "order",
            depth: 1,
            select: PROJECT_LISTING_SELECT,
        });
        return payloadProjects.map(normalizePayloadProjectForListing);
    } catch (error) {
        logError(`Error fetching projects for listing: ${error.message}`, error);
        return [];
    }
};

export const fetchCategoriesMarketsAndStudios = cache(async () => {
    try {
        const [payloadCategories, payloadMarkets, payloadStudios] = await Promise.all([
            queryProjectCategories(),
            queryMarkets(),
            queryStudios(),
        ]);
        return {
            categories: payloadCategories.map(normalizePayloadProjectCategory),
            markets: payloadMarkets.map(normalizePayloadMarketRef),
            studios: payloadStudios.map(normalizePayloadStudio),
        };
    } catch (error) {
        logError(`Error fetching categories, markets, and studios: ${error.message}`, error);
        return { categories: [], markets: [], studios: [] };
    }
});

export const fetchPortfolioPageData = cache(async () => {
    try {
        const [categoriesMarketStudios, projects, markets] = await Promise.all([
            fetchCategoriesMarketsAndStudios(),
            fetchProjectsForListing(),
            fetchMarketsData()
        ]);
        return { categoriesMarketStudios, projects, markets };
    } catch (error) {
        logError(`Error fetching projects page data: ${error.message}`, error);
    }
});

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
    return fetchProjectsForListing({ excludeSlug: slug });
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
    const section = await querySection("project-page-title");
    if (section) {
      const details = sectionToObject(section);
      return {
        otherProjectsTitle: details.otherProjectsTitle || "",
        featuredProductTitle: details.featuredProductTitle || "",
      };
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