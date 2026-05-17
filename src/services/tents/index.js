import { cache } from "react";
import { logError, resolveCoreMediaUrl } from "@/utils";
import { fetchFeaturedProjects, fetchMatchedProductsForProduct } from "../products";
import { fetchMasterClassTenting } from "..";
import {
    queryBlogs,
    normalizePayloadBlogForListing,
    queryProductsFromPayload,
    queryProductCollectionBySlug,
} from "../payloadCollections";

// Slim featured-blog projection: FeaturedBlogCard reads
// {blogRef.{title,coverImage}, markets, studios, slug, author.nickname}.
// The *ForListing normalizer is a superset, so reuse and drop depth:2
// hydration of content body + storeProducts + meta.
const FEATURED_BLOG_SELECT = {
    title: true,
    slug: true,
    excerpt: true,
    coverImage: true,
    author: true,
    markets: true,
    studios: true,
    blogCategories: true,
    publishedDate: true,
    createdAt: true,
    updatedAt: true,
    order: true,
    isHidden: true,
};

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

const fetchTentProducts = async ({ slug } = {}) => {
    const tentsCollection = await queryProductCollectionBySlug("tents").catch(() => null);
    const orderedIds = resolveProductOrderIds(tentsCollection);

    const where = {
        and: [
            { type: { equals: "tent" } },
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

    return { products: sortByConfiguredOrder(docs, orderedIds), tentsCollection };
};

export const fetchTentData = async (slug) => {
    try {
        const { products } = await fetchTentProducts({ slug });
        const product = products[0];
        if (!product) throw new Error(`Tent not found for slug: ${slug}`);
        return normalizeTentItem(product, 1);
    } catch (error) {
        logError(`Error fetching tent data: ${error.message}`, error);
    }
};

export const fetchAllTents = async () => {
    try {
        const { products } = await fetchTentProducts();
        return products.map((p, i) => normalizeTentItem(p, i + 1));
    } catch (error) {
        logError(`Error fetching all tents: ${error.message}`, error);
        return [];
    }
};

// Layout/Header variant. Skips depth: 2 expansion and the heavy normalizer.
// MarketTentModal dropdown reads {title, tagline, slug, headerCoverImage,
// featuredImage, heroBackground, buttonLabel, buttonLabelMenu, tent.mainMedia,
// tent.additionalInfoSections, mainMedia}. The Header tents-ids effect reads
// {_id, id, tent._id, tent.id, productData._id, productData.id} — all map to
// the same product id, so we populate the nested shape from the slim product.
const fetchTentProductsForHeader = async () => {
    const tentsCollection = await queryProductCollectionBySlug("tents").catch(() => null);
    const orderedIds = resolveProductOrderIds(tentsCollection);

    const where = {
        and: [
            { type: { equals: "tent" } },
            { visible: { equals: true } },
            { status: { equals: "active" } },
        ],
    };

    const { docs } = await queryProductsFromPayload({
        where,
        depth: 1,
        limit: 100,
        select: {
            title: true,
            slug: true,
            type: true,
            mainMedia: true,
            additionalInfoSections: true,
        },
    });

    return sortByConfiguredOrder(docs, orderedIds);
};

const normalizeTentItemForHeader = (product, orderNumber = 0) => {
    const mainMediaUrl = resolveCoreMediaUrl(product.mainMedia, "tablet");
    const additionalInfoSections = product.additionalInfoSections ?? [];
    return {
        _id: product.id,
        id: product.id,
        title: product.title || "",
        slug: `/${product.slug || ""}`,
        orderNumber,
        mainMedia: mainMediaUrl,
        tent: {
            _id: product.id,
            id: product.id,
            title: product.title || "",
            slug: product.slug,
            mainMedia: mainMediaUrl,
            additionalInfoSections,
        },
        productData: {
            _id: product.id,
            id: product.id,
        },
    };
};

export const fetchAllTentsForHeader = async () => {
    try {
        const products = await fetchTentProductsForHeader();
        return products.map((p, i) => normalizeTentItemForHeader(p, i + 1));
    } catch (error) {
        logError(`Error fetching all tents (header): ${error.message}`, error);
        return [];
    }
};

// ---------------------------------------------------------------------------
// Listing variant for /types-of-tents. Reads ONLY the fields TentsTypes,
// TentTypesSlider, and BannerStructures actually render:
//   - id (used by the page to fan out featured-projects/blogs fetches)
//   - title, slug, mainMedia (cards + banner background)
//   - additionalInfoSections (INFO / PROS / CONS in BannerStructures)
// Skips depth:2 hydration of mediaItems, recommendedProducts, collections,
// productOptions, tentConfig, description, price — none of which the listing
// page renders. Drops the heavy normalizeTentItem chain that builds the
// gallery + recommendedProducts summaries.
// ---------------------------------------------------------------------------

const fetchTentProductsForListing = async () => {
    const tentsCollection = await queryProductCollectionBySlug("tents").catch(() => null);
    const orderedIds = resolveProductOrderIds(tentsCollection);

    const where = {
        and: [
            { type: { equals: "tent" } },
            { visible: { equals: true } },
            { status: { equals: "active" } },
        ],
    };

    const { docs } = await queryProductsFromPayload({
        where,
        depth: 1,
        limit: 100,
        select: {
            title: true,
            slug: true,
            type: true,
            mainMedia: true,
            additionalInfoSections: true,
        },
    });

    return sortByConfiguredOrder(docs, orderedIds);
};

// Shape matches what Tents/TentsTypes/BannerStructures destructure:
//   item.tent.{_id, id, name, title, slug, mainMedia, additionalInfoSections}
//   item.{id, _id, title, slug}
// The page maps over the result and reads `item.tent._id` to call
// fetchFeaturedProjects/Blogs — so the id MUST be on tent._id.
const normalizeTentItemForListing = (product, orderNumber = 0) => {
    const mainMediaUrl = resolveCoreMediaUrl(product.mainMedia, "tablet");
    const additionalInfoSections = product.additionalInfoSections ?? [];
    return {
        _id: product.id,
        id: product.id,
        title: product.title || "",
        slug: `/${product.slug || ""}`,
        orderNumber,
        tent: {
            _id: product.id,
            id: product.id,
            name: product.title || "",
            title: product.title || "",
            slug: product.slug || "",
            mainMedia: mainMediaUrl,
            additionalInfoSections,
        },
    };
};

export const fetchAllTentsForListing = async () => {
    try {
        const products = await fetchTentProductsForListing();
        return products.map((p, i) => normalizeTentItemForListing(p, i + 1));
    } catch (error) {
        logError(`Error fetching all tents (listing): ${error.message}`, error);
        return [];
    }
};

export const fetchTentPageDetails = async () => {
    return {
        matchItWithTitle: "MATCH IT WITH",
        featuredProductTitle: "Products Featured in this Project Entry",
    };
};

export const fetchTentPageData = async (slug) => {
    try {
        const productData = await fetchTentData(slug);
        if (!productData || !productData.tent) {
            throw new Error("Product data not found");
        }
        const productId = productData.tent._id;
        const matchSourceProduct = {
            ...productData.tent,
            collections: productData.tent?.collections || productData.collections || productData.productData?.collections || [],
        };
        const [
            featuredProjectsData,
            matchedProducts,
            pageDetails,
            masterClassTentingURL,
        ] = await Promise.all([
            fetchFeaturedProjects(productId),
            fetchMatchedProductsForProduct({ payloadProduct: matchSourceProduct, wixProductId: productId }),
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

// Request-cached + slimmed. Mirrors the fetchFeaturedBlogs export in
// services/index.js — both feed the FeaturedBlogs slider.
export const fetchFeaturedBlogs = cache(async (productId) => {
    try {
        if (!productId) return [];
        const payloadBlogs = await queryBlogs({
            where: { storeProducts: { contains: productId } },
            depth: 1,
            select: FEATURED_BLOG_SELECT,
        });
        return payloadBlogs.map(normalizePayloadBlogForListing);
    } catch (error) {
        logError(`Error fetching featured blogs: ${error.message}`, error);
        return [];
    }
});

// ---------------------------------------------------------------------------
// Normalization – map a raw Payload product (type: 'tent', depth >= 2) to the
// shape Hensley components expect: { tent, productData, gallery, collections }.
// ---------------------------------------------------------------------------

const normalizeGalleryItem = (m, i, fallbackTitle) => ({
    id: m?.id || `gallery-${i}`,
    src: resolveCoreMediaUrl(m, "tablet"),
    alt: m?.alt || fallbackTitle || `Tent image ${i + 1}`,
});

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

const normalizeTentItem = (product, orderNumber = 0) => {
    const mediaItems = Array.isArray(product.mediaItems) ? product.mediaItems : [];
    const gallery = mediaItems.map((m, i) => normalizeGalleryItem(m, i, product.title));

    const mainMediaUrl = resolveCoreMediaUrl(product.mainMedia, "tablet");

    const collections = buildCollectionSummary(product.collections);
    const recommendedProducts = normalizeRecommendedProducts(product);

    const tentConfig = product.tentConfig || {};
    const tent = {
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
        tentConfig: {
            quoteIntroText: tentConfig.quoteIntroText ?? "",
            quoteSubmitLabel: tentConfig.quoteSubmitLabel ?? "Add to Quote",
            quoteRequestFields: Array.isArray(tentConfig.quoteRequestFields)
                ? tentConfig.quoteRequestFields
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
        tent,
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
            tentConfig: tent.tentConfig,
            collections,
            recommendedProducts,
        },
        gallery,
        collections,
        recommendedProducts,
    };
};
