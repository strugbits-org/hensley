"use server";
import { findSortIndexByCategory, logError } from "@/utils";
import { fetchOurCategoriesData } from "..";
import { queryProductCollectionBySlug, queryProductCollections, queryProductsByCollectionIdsPaginated, queryProductBanners } from "../payloadCollections";


export const fetchCategoryPageDetails = async () => {
    return { ourCategoryTitle: "Our Categories" };
};


export const fetchSelectedCollectionData = async (slug) => {
    try {
        const [ourCategoriesData, selectedCategory, categoriesSortData, productBannersData, pageDetails, allCollections] = await Promise.all([
            fetchOurCategoriesData(),
            queryProductCollectionBySlug(slug),
            fetchCategoriesSortStructure(),
            fetchProductBannersData(),
            fetchCategoryPageDetails(),
            queryProductCollections(),
        ]);

        if (!selectedCategory) {
            throw new Error(`Category with slug "${slug}" not found`);
        }

        const subCategories = selectedCategory?.children?.docs
            || selectedCategory?.children
            || [];

        // Recursively collect IDs from all descendant collections (grandchildren etc.)
        const getAllDescendantIds = (collection) => {
            const id = collection?.id || collection?._id;
            const ids = id ? [id] : [];
            const children = collection?.children?.docs || (Array.isArray(collection?.children) ? collection.children : []);
            children.forEach(child => {
                if (child && typeof child === 'object') ids.push(...getAllDescendantIds(child));
                else if (typeof child === 'string') ids.push(child);
            });
            return ids;
        };

        const collectionIds = getAllDescendantIds(selectedCategory);
        const sortIndex = findSortIndexByCategory(categoriesSortData, selectedCategory.id);

        const sortedProducts = await queryProductsByCollectionIdsPaginated({
            collections: collectionIds,
            limit: 12,
            skip: 0,
        });

        const data = {
            selectedCategory,
            ourCategoriesData,
            subCategories,
            categoriesSortData,
            productBannersData,
            collectionIds,
            sortIndex,
            sortedProducts,
            pageDetails,
            allCollections: Array.isArray(allCollections) ? allCollections : [],
        }

        return data;
    } catch (error) {
        logError(`Error fetching selected collection data: ${error.message}`, error);
    }
}

export const fetchSubcategoriesData = async () => {
    return null;
};

export const fetchCategoriesSortStructure = async () => {
    return [];
};

export const fetchProductBannersData = async () => {
    try {
        return await queryProductBanners();
    } catch (error) {
        logError('Error fetching product banners data:', error);
        return [];
    }
};

export const fetchSortedProducts = async ({ collectionIds = [], limit = 12, skip = 0, sortIndex }) => {
    try {
        return queryProductsByCollectionIdsPaginated({ collections: collectionIds, limit, skip });
    } catch (error) {
        logError(`Error fetching sorted products data: ${error.message}`, error);
        return { items: [], hasNext: false };
    }
};

export const fetchCollectionPagePaths = async () => {
    try {
        const allCollections = await queryProductCollections();
        // Top-level collections (no parent) map to /collections/[slug]
        const topLevel = allCollections.filter(c => !c.parent && c.slug);
        const seen = new Set();
        return topLevel.reduce((acc, c) => {
            const slug = c.slug.trim().replace("/", "");
            if (slug && !seen.has(slug)) {
                seen.add(slug);
                acc.push({ slug });
            }
            return acc;
        }, []);
    } catch (error) {
        logError(`Error fetching collection page params: ${error.message}`, error);
        return [];
    }
};