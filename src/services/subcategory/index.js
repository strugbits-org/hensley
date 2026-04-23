"use server";
import { findSortIndexByCategory, logError } from "@/utils";
import { fetchOurCategoriesData } from "..";
import { fetchCategoriesSortStructure, fetchProductBannersData, fetchSortedProducts } from "../collections";
import queryCollection from "@/utils/fetchFunction";
import { queryProductCollectionBySlug } from "../payloadCollections";


export const fetchsubCategoriesPageDetails = async () => {
    try {
        const pageDetails = await queryCollection({ dataCollectionId: "subCategoryPageDetails" });

        if (!Array.isArray(pageDetails.items)) {
            throw new Error(`PrivacyPolicy response does not contain items array`);
        }

        return pageDetails.items[0]

    } catch (error) {
        logError(`Error fetching contact page data: ${error.message}`, error);
    }
};

export const fetchSelectedCategoryData = async (slug) => {
    try {
        const [ourCategoriesData, categoriesSortData, productBannersData, pageDetails] = await Promise.all([
            fetchOurCategoriesData(),
            fetchCategoriesSortStructure(),
            fetchProductBannersData(),
            fetchsubCategoriesPageDetails()
        ]);

        // const selectedCategory = categoriesData.find(category => category.slug === slug);
        const selectedCategory = await queryProductCollectionBySlug(slug);

        if (!selectedCategory) {
            throw new Error(`Category with slug "${slug}" not found`);
        }

        // const subCategoriesData = await fetchSubcategoriesData(selectedCategory._id);
        const subCategories = selectedCategory?.children?.docs
            || selectedCategory?.children
            || [];

        // const subCategories = subCategoriesData?.subcategories || [];

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

        const sortedProducts = await fetchSortedProducts({
            collectionIds,
            limit: 12,
            skip: 0,
            sortIndex
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

export const fetchSubCategoryPagePaths = async () => {
    try {
        const response = await queryCollection({ dataCollectionId: "Stores/Collections", limit: "infinite", extendedLimit: 100 });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }
        return response.items.map(x => ({ slug: x.slug.trim().replace("/", "") }));
    } catch (error) {
        logError(`Error fetching sub category page params: ${error.message}`, error);
        return [];
    }
};

export const fetchAllCategoriesForSorting = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "CategorySortStructure",
            includeReferencedItems: ["collections"],
            increasedLimit: 100,
            limit: "infinite",
        });

        if (!response?.items?.length) {
            return [];
        }

        return response.items.filter(item => item.sortTitle?.length > 0).sort((a, b) => a.collections.name.localeCompare(b.collections.name));

    } catch (error) {
        logError("Error fetching all categories from Stores/Collections:", error);
        return [];
    }
};