import { logError, resolveCoreMediaUrl } from "@/utils";
import { fetchFeaturedProjects, fetchMatchedProductsForProduct } from "../products";
import {
    queryProductsFromPayload,
    queryProductCollectionBySlug,
} from "../payloadCollections";

const sortByConfiguredOrder = (products, orderedIds) => {
    if (!orderedIds?.length) return products;
    const orderMap = new Map(orderedIds.map((id, i) => [String(id), i]));
    return [...products].sort((a, b) => {
        const ai = orderMap.get(String(a.id));
        const bi = orderMap.get(String(b.id));
        if (ai == null && bi == null) return (a.title || "").localeCompare(b.title || "");
        if (ai == null) return 1;
        if (bi == null) return -1;
        return ai - bi;
    });
};

const resolveProductOrderIds = (collection) => {
    const order = collection?.productOrder;
    if (!Array.isArray(order)) return [];
    return order
        .map((item) => (typeof item === "string" ? item : item?.id || item?._id || null))
        .filter(Boolean);
};

const fetchPoolCoverProducts = async ({ slug } = {}) => {
    const poolCoversCollection = await queryProductCollectionBySlug("pool-covers").catch(() => null);
    const orderedIds = resolveProductOrderIds(poolCoversCollection);

    const where = {
        and: [
            { type: { equals: "pool_cover" } },
            { visible: { equals: true } },
            { status: { equals: "active" } },
            ...(slug ? [{ slug: { equals: slug } }] : []),
        ],
    };

    const { docs } = await queryProductsFromPayload({
        where,
        depth: 2,
        limit: slug ? 1 : 100,
    });

    return { products: sortByConfiguredOrder(docs, orderedIds), poolCoversCollection };
};

export const fetchPoolCovers = async () => {
    try {
        const { products } = await fetchPoolCoverProducts();
        return products.map((p, i) => normalizePoolCoverItem(p, i + 1));
    } catch (error) {
        logError(`Error fetching covers data: ${error.message}`, error);
        return [];
    }
};

export const fetchPoolCoverData = async (slug) => {
    try {
        const { products } = await fetchPoolCoverProducts({ slug });
        const product = products[0];
        if (!product) throw new Error(`Pool cover not found for slug: ${slug}`);
        return normalizePoolCoverItem(product, 1);
    } catch (error) {
        logError(`Error fetching covers data: ${error.message}`, error);
    }
};

export const fetchPoolCoverPageData = async (slug) => {
    try {
        const productData = await fetchPoolCoverData(slug);

        // Not a valid pool-cover slug — return null so the page renders notFound().
        if (!productData || !productData.covers) {
            return null;
        }
        const productId = productData.covers._id;
        const matchSourceProduct = {
            ...productData.covers,
            collections: productData.covers?.collections || productData.collections || productData.productData?.collections || [],
            recommendedProducts: productData.recommendedProducts || productData.productData?.recommendedProducts || [],
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
};

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
};

// ---------------------------------------------------------------------------
// Normalization – map a raw Payload product (type: 'pool_cover', depth >= 2)
// to the shape Hensley components expect: { covers, productData, mediagallery, collections }.
// ---------------------------------------------------------------------------

const buildCollectionSummary = (collections) => {
    if (!Array.isArray(collections)) return [];
    return collections
        .map((c) => {
            if (!c || typeof c === "string") return null;
            return {
                id: c.id,
                name: c.name,
                slug: c.slug,
                ribbon: c.ribbon ?? null,
            };
        })
        .filter(Boolean);
};

const normalizeRecommendedProducts = (product) => {
    if (!Array.isArray(product?.recommendedProducts)) return [];
    return product.recommendedProducts
        .map((rp) => {
            if (!rp || typeof rp === "string") return null;
            if (rp.id === product.id || rp.status !== "active" || rp.visible === false) return null;
            return {
                id: rp.id,
                title: rp.title,
                slug: rp.slug,
                type: rp.type,
                price: rp.price ?? null,
                ribbon: rp.ribbon ?? null,
                mainMedia: resolveCoreMediaUrl(rp.mainMedia, "card"),
                collections: buildCollectionSummary(rp.collections),
            };
        })
        .filter(Boolean);
};

const normalizePoolCoverItem = (product, orderNumber = 0) => {
    const mediaItems = Array.isArray(product.mediaItems) ? product.mediaItems : [];
    const gallery = mediaItems.map((m, i) => ({
        id: m?.id || `gallery-${i}`,
        src: resolveCoreMediaUrl(m, "tablet"),
        alt: m?.alt || product.title || `Pool cover image ${i + 1}`,
    }));

    const mainMediaUrl = resolveCoreMediaUrl(product.mainMedia, "tablet");

    const poolCoverConfig = product.poolCoverConfig || {};

    const collections = buildCollectionSummary(product.collections);
    const recommendedProducts = normalizeRecommendedProducts(product);

    const covers = {
        _id: product.id,
        id: product.id,
        name: product.title,
        title: product.title,
        slug: product.slug,
        price: product.price,
        description: product.description ?? null,
        mainMedia: mainMediaUrl,
        mediaItems: mediaItems.map((m) => ({ ...m, src: resolveCoreMediaUrl(m, "tablet") })),
        additionalInfoSections: product.additionalInfoSections ?? [],
        productOptions: product.productOptions ?? [],
        poolCoverConfig: {
            quoteIntroText: poolCoverConfig.quoteIntroText ?? "",
            quoteSubmitLabel: poolCoverConfig.quoteSubmitLabel ?? "Request a Quote",
            quoteRequestFields: Array.isArray(poolCoverConfig.quoteRequestFields)
                ? poolCoverConfig.quoteRequestFields
                : [],
        },
        collections,
    };

    return {
        _id: product.id,
        id: product.id,
        title: product.title || "",
        slug: `/${product.slug || ""}`,
        orderNumber,
        price: product.price ?? 0,
        covers,
        productData: {
            _id: product.id,
            id: product.id,
            name: product.title,
            title: product.title,
            slug: product.slug,
            price: product.price,
            description: product.description ?? null,
            additionalInfoSections: product.additionalInfoSections ?? [],
            productOptions: product.productOptions ?? [],
            poolCoverConfig: covers.poolCoverConfig,
            collections,
            recommendedProducts,
        },
        mediagallery: gallery,
        collections,
        recommendedProducts,
    };
};
