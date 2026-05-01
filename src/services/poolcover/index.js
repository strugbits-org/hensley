import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchFeaturedProjects, fetchMatchedProductsForProduct } from "../products";

const baseUrl = process.env.BASE_URL;
const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || "";

const resolveMediaUrl = (media) => {
    if (!media) return "";
    if (typeof media === "string") return media;
    return media.url || media.src || "";
};

const normalizePoolCoverItem = (item) => {
    const poolCover = item.poolCover || item.covers || item.productData || item;
    const productData = item.productData || poolCover;
    const gallery = (item.gallery || poolCover.mediaItems || []).map((m, i) => ({
        id: m.id || `gallery-${i}`,
        src: resolveMediaUrl(m),
        alt: m.alt || poolCover.title || `Pool cover image ${i + 1}`,
    }));

    const mainMediaUrl = resolveMediaUrl(poolCover.mainMedia);
    if (mainMediaUrl && !gallery.some((g) => g.src === mainMediaUrl)) {
        gallery.unshift({
            id: poolCover.mainMedia?.id || "main-media",
            src: mainMediaUrl,
            alt: poolCover.mainMedia?.alt || poolCover.title || "Pool cover main image",
        });
    }

    // Normalize relevant images from poolCoverConfig
    const poolCoverConfig = poolCover.poolCoverConfig || {};
    const relevantImages = (poolCoverConfig.relevantImages || []).map((m, i) => ({
        id: m.id || `relevant-image-${i}`,
        src: resolveMediaUrl(m),
        alt: m.alt || `Relevant reference image ${i + 1}`,
    }));

    return {
        _id: item._id || item.id || poolCover._id || poolCover.id,
        id: item.id || item._id || poolCover.id || poolCover._id,
        title: item.title || poolCover.title || poolCover.name || "",
        slug: item.slug || poolCover.slug || "",
        orderNumber: item.orderNumber ?? 0,
        price: poolCover.price ?? 0,
        covers: {
            ...poolCover,
            _id: poolCover._id || poolCover.id,
            id: poolCover.id || poolCover._id,
            name: poolCover.name || poolCover.title || "",
            slug: poolCover.slug || "",
            mainMedia: resolveMediaUrl(poolCover.mainMedia),
            mediaItems: (poolCover.mediaItems || []).map((m) => ({
                ...m,
                src: resolveMediaUrl(m),
            })),
            additionalInfoSections: poolCover.additionalInfoSections || [],
            productOptions: poolCover.productOptions || [],
            poolCoverConfig: {
                ...poolCoverConfig,
                relevantImages,
                quoteIntroText: poolCoverConfig.quoteIntroText || "",
                quoteSubmitLabel: poolCoverConfig.quoteSubmitLabel || "Request a Quote",
                quoteRequestFields: poolCoverConfig.quoteRequestFields || [],
            },
            description: poolCover.description || "",
        },
        productData: {
            ...productData,
            _id: productData._id || productData.id,
            id: productData.id || productData._id,
        },
        mediagallery: gallery,
        collections: item.collections || productData.collections || [],
    };
};

export const fetchPoolCovers = async () => {
    try {
        if (CORE_API_BASE_URL) {
            const res = await fetch(
                `${CORE_API_BASE_URL}/api/products/pool-cover`,
                { next: { revalidate: Number(process.env.REVALIDATE_TIME) || 60 } }
            );

            if (!res.ok) throw new Error(`Core pool-cover API returned ${res.status}`);
            const json = await res.json();
            if (!Array.isArray(json.items)) throw new Error("Core API did not return items array");

            return json.items.map(normalizePoolCoverItem);
        }

        const response = await queryCollection({
            dataCollectionId: "PoolCovers",
            includeReferencedItems: ["covers", "productData"],
        });

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching covers data: ${error.message}`, error);
    }
};

export const fetchPoolCoverData = async (slug) => {
    try {
        if (CORE_API_BASE_URL) {
            const res = await fetch(
                `${CORE_API_BASE_URL}/api/products/pool-cover?slug=${encodeURIComponent(slug)}`,
                { next: { revalidate: Number(process.env.REVALIDATE_TIME) || 60 } }
            );

            if (!res.ok) throw new Error(`Core pool-cover API returned ${res.status}`);
            const json = await res.json();
            if (!json.item) throw new Error("Pool cover not found in core API");

            return normalizePoolCoverItem(json.item);
        }

        const response = await queryCollection({
            dataCollectionId: "PoolCovers",
            includeReferencedItems: ["covers", "productData"],
            eq: [
                {
                    key: "slug",
                    value: slug
                }
            ],
            sortKey: "order"
        });

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items[0];
    } catch (error) {
        logError(`Error fetching covers data: ${error.message}`, error);
    }
};

export const fetchPoolCoverPageData = async (slug) => {
    try {
        const productData = await fetchPoolCoverData(slug);

        if (!productData || !productData.covers) {
            throw new Error("Product data not found");
        }
        const productId = productData.covers._id;
        const matchSourceProduct = {
            ...productData.covers,
            collections: productData.covers?.collections || productData.collections || productData.productData?.collections || [],
        };
        const [
            featuredProjectsData,
            matchedProducts
        ] = await Promise.all([
            fetchFeaturedProjects(productId),
            fetchMatchedProductsForProduct({ payloadProduct: matchSourceProduct, wixProductId: productId })
        ]);

        return {
            productData,
            featuredProjectsData,
            matchedProducts
        };
    } catch (error) {
        logError(`Error fetching product data: ${error.message}`, error);
        throw error;
    }
}
export const uploadRelevantImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/media/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            let details = "";
            try {
                const errorPayload = await response.json();
                details = errorPayload?.details || errorPayload?.error || "";
            } catch {
                details = await response.text();
            }
            throw new Error(`HTTP error! status: ${response.status}${details ? ` - ${details}` : ""}`);
        }

        return await response.json();
    } catch (error) {
        logError(`Error uploading image: ${error.message}`, error);
        throw error;
    }
}