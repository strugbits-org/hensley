import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchFeaturedProjects, fetchMatchedProducts } from "../products";
import { fetchMasterClassTenting } from "..";

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || "";

/**
 * Fetch a single tent product by slug from the core API.
 * Falls back to the legacy Wix collection if the core API is not configured.
 */
export const fetchTentData = async (slug) => {
    try {
        if (CORE_API_BASE_URL) {
            const res = await fetch(
                `${CORE_API_BASE_URL}/api/products/tent?slug=${encodeURIComponent(slug)}`,
                { next: { revalidate: Number(process.env.REVALIDATE_TIME) || 60 } }
            );

            if (!res.ok) throw new Error(`Core tent API returned ${res.status}`);
            const json = await res.json();
            if (!json.item) throw new Error("Tent not found in core API");

            return normalizeTentItem(json.item);
        }

        // Legacy Wix fallback
        const response = await queryCollection({
            dataCollectionId: "TentsCollection",
            includeReferencedItems: ["tent", "productData"],
            eq: [{ key: "slug", value: `/${slug}` }],
            sortKey: "orderNumber",
        });

        if (!Array.isArray(response.items)) throw new Error("Response does not contain items array");
        return response.items[0];
    } catch (error) {
        logError(`Error fetching tent data: ${error.message}`, error);
    }
};

/**
 * Fetch all tent products from the core API.
 */
export const fetchAllTents = async () => {
    try {
        if (CORE_API_BASE_URL) {
            const res = await fetch(
                `${CORE_API_BASE_URL}/api/products/tent`,
                { next: { revalidate: Number(process.env.REVALIDATE_TIME) || 60 } }
            );

            if (!res.ok) throw new Error(`Core tent API returned ${res.status}`);
            const json = await res.json();
            if (!Array.isArray(json.items)) throw new Error("Core API did not return items array");

            return json.items.map(normalizeTentItem);
        }

        // Legacy Wix fallback
        const response = await queryCollection({
            dataCollectionId: "TentsCollection",
            includeReferencedItems: ["tent", "productData"],
            sortKey: "orderNumber",
        });

        if (!Array.isArray(response.items)) throw new Error("Response does not contain items array");
        return response.items;
    } catch (error) {
        logError(`Error fetching all tents: ${error.message}`, error);
        return [];
    }
};

export const fetchTentPageDetails = async () => {
    try {
        const pageDetails = await queryCollection({ dataCollectionId: "dynamicTentPageDetails" });

        if (!Array.isArray(pageDetails.items)) {
            throw new Error(`Page details response does not contain items array`);
        }

        return pageDetails.items[0];
    } catch (error) {
        logError(`Error fetching tent page details: ${error.message}`, error);
        return {};
    }
};

export const fetchTentPageData = async (slug) => {
    try {
        const productData = await fetchTentData(slug);
        if (!productData || !productData.tent) {
            throw new Error("Product data not found");
        }
        const productId = productData.tent._id;
        const [
            featuredProjectsData,
            matchedProducts,
            pageDetails,
            masterClassTentingURL,
        ] = await Promise.all([
            fetchFeaturedProjects(productId),
            fetchMatchedProducts(productId),
            fetchTentPageDetails(),
            fetchMasterClassTenting(),
        ]);

        return {
            productData,
            featuredProjectsData,
            matchedProducts,
            pageDetails,
            masterClassTentingURL,
        };
    } catch (error) {
        logError(`Error fetching tent page data: ${error.message}`, error);
    }
};

export const fetchFeaturedBlogs = async (productId) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ["blogRef", "markets", "studios", "author", "storeProducts"],
            ne: [{ key: "isHidden", value: true }],
            hasSome: [{ key: "storeProducts", values: [productId] }],
            sortKey: "publishDate",
            sortOrder: "desc",
        });

        if (!Array.isArray(response.items) || response.items.length === 0) {
            throw new Error("Selected blog not found");
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching featured blogs: ${error.message}`, error);
    }
};

// ---------------------------------------------------------------------------
// Normalization helpers – map the core API response to the shape that the
// existing Hensley components expect (`tent`, `productData`, `gallery`, etc.)
// ---------------------------------------------------------------------------

const resolveMediaUrl = (media) => {
    if (!media) return "";
    if (typeof media === "string") return media;
    return media.url || media.src || "";
};

const normalizeTentItem = (item) => {
    const tent = item.tent || item.productData || item;
    const productData = item.productData || tent;
    const gallery = (item.gallery || tent.mediaItems || []).map((m, i) => ({
        id: m.id || `gallery-${i}`,
        src: resolveMediaUrl(m),
        alt: m.alt || tent.title || `Tent image ${i + 1}`,
    }));

    // Ensure mainMedia is in the gallery as first item
    const mainMediaUrl = resolveMediaUrl(tent.mainMedia);
    if (mainMediaUrl && !gallery.some((g) => g.src === mainMediaUrl)) {
        gallery.unshift({
            id: tent.mainMedia?.id || "main-media",
            src: mainMediaUrl,
            alt: tent.mainMedia?.alt || tent.title || "Tent main image",
        });
    }

    return {
        _id: item._id || item.id || tent._id || tent.id,
        id: item.id || item._id || tent.id || tent._id,
        title: item.title || tent.title || tent.name || "",
        slug: item.slug || tent.slug || "",
        orderNumber: item.orderNumber ?? 0,
        price: tent.price ?? 0,
        tent: {
            ...tent,
            _id: tent._id || tent.id,
            id: tent.id || tent._id,
            name: tent.name || tent.title || "",
            slug: tent.slug || "",
            mainMedia: resolveMediaUrl(tent.mainMedia),
            mediaItems: (tent.mediaItems || []).map((m) => ({
                ...m,
                src: resolveMediaUrl(m),
            })),
            additionalInfoSections: tent.additionalInfoSections || [],
            productOptions: tent.productOptions || [],
            tentConfig: tent.tentConfig || {},
            description: tent.description || "",
        },
        productData: {
            ...productData,
            _id: productData._id || productData.id,
            id: productData.id || productData._id,
        },
        gallery,
        collections: item.collections || productData.collections || [],
    };
};