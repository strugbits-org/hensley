"use server";
import { findSortIndexByCategory, logError } from "@/utils";
import { fetchCategoriesData } from "../products";
import { fetchOurCategoriesData } from "..";
import { fetchCategoriesSortStructure, fetchProductBannersData, fetchSortedProducts, fetchSubcategoriesData } from "../collections";
import queryCollection from "@/utils/fetchFunction";


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
        const [ourCategoriesData, categoriesData, categoriesSortData, productBannersData, pageDetails] = await Promise.all([
            fetchOurCategoriesData(),
            fetchCategoriesData(),
            fetchCategoriesSortStructure(),
            fetchProductBannersData(),
            fetchsubCategoriesPageDetails()
        ]);

        const selectedCategory = categoriesData.find(category => category.slug === slug);
        if (!selectedCategory) {
            throw new Error(`Category with slug "${slug}" not found`);
        }

        const subCategoriesData = await fetchSubcategoriesData(selectedCategory._id);
        const subCategories = subCategoriesData?.subcategories || [];

        const collectionIds = [selectedCategory._id, ...subCategories.map(item => item._id)];
        const sortIndex = findSortIndexByCategory(categoriesSortData, selectedCategory._id);

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