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
        const [ourCategoriesData, categoriesSortData, productBannersData, pageDetails, allCollections] = await Promise.all([
            fetchOurCategoriesData(),
            fetchCategoriesSortStructure(),
            fetchProductBannersData(),
            fetchsubCategoriesPageDetails(),
            queryProductCollections(),
        ]);

        // const selectedCategory = categoriesData.find(category => category.slug === slug);
        const selectedCategory = await queryProductCollectionBySlug(slug);

        if (!selectedCategory) {
            throw new Error(`Category with slug "${slug}" not found`);
        }

        const subCategories = Array.isArray(selectedCategory?.subcategories)
            ? selectedCategory.subcategories
            : [];

        const collectionsById = new Map(
            (Array.isArray(allCollections) ? allCollections : []).map((c) => [c.id || c._id, c])
        );

        // DAG-aware descendant walker (multi-parent graph — guard against revisits).
        const getAllDescendantIds = (collection) => {
            const visited = new Set();
            const stack = [collection];
            while (stack.length) {
                const current = stack.pop();
                const id = current?.id || current?._id;
                if (!id || visited.has(id)) continue;
                visited.add(id);
                const subs = Array.isArray(current?.subcategories) ? current.subcategories : [];
                for (const sub of subs) {
                    if (sub && typeof sub === 'object') stack.push(sub);
                    else if (typeof sub === 'string') {
                        const resolved = collectionsById.get(sub);
                        if (resolved) stack.push(resolved);
                        else if (!visited.has(sub)) visited.add(sub);
                    }
                }
            }
            return Array.from(visited);
        };

        const collectionIds = getAllDescendantIds(selectedCategory);
        const sortIndex = findSortIndexByCategory(categoriesSortData, selectedCategory.id);

        // Extract ordered product IDs from the productOrder relationship field.
        const productOrder = Array.isArray(selectedCategory.productOrder)
            ? selectedCategory.productOrder
                .map(p => (typeof p === 'string' ? p : p?.id ?? p?._id))
                .filter(Boolean)
            : [];

        const sortedProducts = await fetchSortedProducts({
            collectionIds,
            limit: 12,
            skip: 0,
            productOrder,
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
            productOrder,
            pageDetails,
            allCollections: Array.isArray(allCollections) ? allCollections : [],
        }

        return data;
    } catch (error) {
        logError(`Error fetching selected collection data: ${error.message}`, error);
        return null;
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