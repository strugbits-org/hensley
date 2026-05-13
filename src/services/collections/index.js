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

        const subCategories = Array.isArray(selectedCategory?.subcategories)
            ? selectedCategory.subcategories
            : [];

        const collectionsById = new Map(
            (Array.isArray(allCollections) ? allCollections : []).map((c) => [c.id || c._id, c])
        );

        // DAG-aware descendant walker. The same collection can appear under
        // multiple parents, so we guard against revisiting a node.
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
        // Top-level = collections that don't appear in anyone else's subcategories.
        // With a many-to-many hierarchy a collection can have multiple parents, so
        // we derive "is this a root" by reverse-indexing across all collections.
        const childIds = new Set();
        for (const c of allCollections) {
            const subs = Array.isArray(c?.subcategories) ? c.subcategories : [];
            for (const s of subs) {
                if (typeof s === 'string') childIds.add(s);
                else if (s && typeof s === 'object' && (s.id || s._id)) childIds.add(s.id || s._id);
            }
        }
        const topLevel = allCollections.filter(c => c.slug && !childIds.has(c.id));
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