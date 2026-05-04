"use server";
import { findSortIndexByCategory, logError } from "@/utils";
import { fetchOurCategoriesData } from "..";
import { fetchCategoriesSortStructure, fetchProductBannersData, fetchSortedProducts } from "../collections";
import { queryProductCollectionBySlug, queryProductCollections } from "../payloadCollections";


export const fetchsubCategoriesPageDetails = async () => {
    return { ourCategoriesTitle: "Our Categories" };
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
        const allCollections = await queryProductCollections();
        const seen = new Set();
        return (Array.isArray(allCollections) ? allCollections : [])
            .filter(c => c.slug)
            .reduce((acc, c) => {
                const slug = c.slug.trim().replace("/", "");
                if (slug && !seen.has(slug)) {
                    seen.add(slug);
                    acc.push({ slug });
                }
                return acc;
            }, []);
    } catch (error) {
        logError(`Error fetching sub category page params: ${error.message}`, error);
        return [];
    }
};

export const fetchAllCategoriesForSorting = async () => {
    return [];
};