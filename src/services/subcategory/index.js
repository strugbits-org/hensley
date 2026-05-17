"use server";
import { cache } from "react";
import { logError } from "@/utils";
import { fetchOurCategoriesData } from "..";
import { fetchProductBannersData, fetchSortedProductsForListing } from "../collections";
import { queryProductCollectionBySlug, queryProductCollections } from "../payloadCollections";


export const fetchsubCategoriesPageDetails = async () => {
    return { ourCategoriesTitle: "Our Categories" };
};

// Normalise the slug at the service boundary: Payload stores slugs as
// lowercase, but URLs reach us in mixed case (e.g. /subcategory/HIGHLIGHTS).
// Doing this here means generateMetadata and the page handler hit the same
// cache key and we don't burn an upstream request on a doomed query.
const normaliseCategorySlug = (slug) => {
    if (!slug) return slug;
    const lower = String(slug).toLowerCase();
    return lower === "bars-&-backbars" ? "bars-backbars" : lower;
};

export const fetchSelectedCategoryData = cache(async (rawSlug) => {
    try {
        const slug = normaliseCategorySlug(rawSlug);
        const [ourCategoriesData, productBannersData, pageDetails, allCollections, selectedCategory] = await Promise.all([
            fetchOurCategoriesData(),
            fetchProductBannersData(),
            fetchsubCategoriesPageDetails(),
            queryProductCollections(),
            queryProductCollectionBySlug(slug),
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

        // Extract ordered product IDs from the productOrder relationship field.
        const productOrder = Array.isArray(selectedCategory.productOrder)
            ? selectedCategory.productOrder
                .map(p => (typeof p === 'string' ? p : p?.id ?? p?._id))
                .filter(Boolean)
            : [];

        const sortedProducts = await fetchSortedProductsForListing({
            collectionIds,
            limit: 12,
            skip: 0,
            productOrder,
        });

        const data = {
            selectedCategory,
            ourCategoriesData,
            subCategories,
            categoriesSortData: [],
            productBannersData,
            collectionIds,
            sortIndex: 0,
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
});

export const fetchSubCategoryPagePaths = cache(async () => {
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
});

export const fetchAllCategoriesForSorting = async () => {
    return [];
};