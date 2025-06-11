"use server";
import { findSortIndexByCategory, logError } from "@/utils";
import { fetchCategoriesData } from "../products";
import { fetchOurCategoriesData } from "..";
import queryCollection from "@/utils/fetchFunction";

export const fetchSelectedCollectionData = async (slug) => {
    try {
        const [ourCategoriesData, categoriesData, categoriesSortData, productBannersData] = await Promise.all([
            fetchOurCategoriesData(),
            fetchCategoriesData(),
            fetchCategoriesSortStructure(),
            fetchProductBannersData()
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
            sortedProducts
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

export const fetchSortedProducts = async ({ collectionIds, limit = 12, skip = 0, sortIndex }) => {
    try {
        const payload = {
            dataCollectionId: "FullProductData",
            includeReferencedItems: ["product", "mainCategory"],
            hasSome: [
                {
                    key: "categories",
                    values: collectionIds
                }
            ],
            limit,
            skip
        };

        if (sortIndex) {
            payload.sortKey = sortIndex;
        }

        const response = await queryCollection(payload);

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }
        return {
            items: response.items,
            hasNext: response.paging.hasNext
        };

    } catch (error) {
        logError(`Error fetching sorted products data: ${error.message}`, error);
    }
};