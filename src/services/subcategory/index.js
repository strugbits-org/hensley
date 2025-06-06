"use server";
import { findSortIndexByCategory, logError } from "@/utils";
import { fetchCategoriesData } from "../products";
import { fetchOurCategoriesData } from "..";
import queryCollection from "@/utils/fetchFunction";
import { fetchCategoriesSortStructure, fetchProductBannersData, fetchSortedProducts, fetchSubcategoriesData } from "../collections";

export const fetchSelectedCategoryData = async (slug) => {
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