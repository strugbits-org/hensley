"use server";
import { findSortIndexByCategory, logError } from "@/utils";
import { fetchOurCategoriesData } from "..";
import queryCollection from "@/utils/fetchFunction";
import { queryProductCollectionBySlug, queryProductCollections, queryProductsByCollectionIdsPaginated } from "../payloadCollections";


export const fetchCategoryPageDetails = async () => {
    try {
        const pageDetails = await queryCollection({ dataCollectionId: "categoryPageDetails" });

        if (!Array.isArray(pageDetails.items)) {
            throw new Error(`PrivacyPolicy response does not contain items array`);
        }

        return pageDetails.items[0]

    } catch (error) {
        logError(`Error fetching contact page data: ${error.message}`, error);
    }
};


export const fetchSelectedCollectionData = async (slug) => {
    try {
        const [ourCategoriesData, selectedCategory, categoriesSortData, productBannersData, pageDetails] = await Promise.all([
            fetchOurCategoriesData(),
            queryProductCollectionBySlug(slug),
            fetchCategoriesSortStructure(),
            fetchProductBannersData(),
            fetchCategoryPageDetails()
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
            pageDetails
        }

        return data;
    } catch (error) {
        logError(`Error fetching selected collection data: ${error.message}`, error);
    }
}

export const fetchSubcategoriesData = async (categoryId) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "CategoriesStructure",
            includeReferencedItems: ["subcategories"],
            eq: [
                {
                    key: "category",
                    value: categoryId
                }
            ]
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }
        return response.items[0];
    } catch (error) {
        logError(`Error fetching subcategories data: ${error.message}`, error);
    }
}

export const fetchCategoriesSortStructure = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "CategorySortStructure",
            limit: 1000,
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }
        return response.items;
    } catch (error) {
        logError(`Error fetching category sort structure: ${error.message}`, error);
    }
}

export const fetchProductBannersData = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "PRODUCTSUBCATEGORYBANNERS",
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }
        return response.items;
    } catch (error) {
        logError(`Error fetching product banners data: ${error.message}`, error);
    }
}

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