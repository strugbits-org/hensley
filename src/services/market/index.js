import { cache } from "react";
import { logError } from "@/utils";
import { fetchBannerData, fetchMarketsData, fetchTestimonials } from "..";
import {
    queryProjects,
    queryBlogs,
    queryMarkets,
    querySection,
    sectionToObject,
    normalizePayloadProjectForHome,
    normalizePayloadBlogForHome,
    queryProductsByCollectionIdsForHome,
} from "../payloadCollections";

const fallbackMarketPageDetails = {
    bestSellerTitle: "BEST SELLERS",
    marketsTitle: "OUR MARKETS",
    howWeDoItTitle: "HOW WE DO IT",
    testimonialsTitle: "WHAT PEOPLE SAY",
    hensleyNewsTitle: "HENSLEY NEWS",
    buttonLabelPortfolioSlider: "OUR PROJECTS",
};

export const fetchMarketPageDetails = cache(async () => {
    try {
        const section = await querySection("market-page-details");
        if (section) {
            const details = sectionToObject(section);
            return { ...fallbackMarketPageDetails, ...details };
        }
    } catch (error) {
        logError(`Error fetching market page details: ${error.message}`, error);
    }
    return fallbackMarketPageDetails;
});

const resolveHowWeDoItImage = (item = {}) => {
    if (!item) return "";
    const image = item.image || item.image1 || item.mainMedia || item.media;

    if (typeof image === "string") return image;
    if (typeof image?.url === "string") return image.url;
    if (typeof image?.mainMedia === "string") return image.mainMedia;
    if (typeof image?.mainMedia?.url === "string") return image.mainMedia.url;
    if (typeof image?.thumbnailURL === "string") return image.thumbnailURL;

    return "";
};

const buildMarketLookupIds = (selectedMarket = {}) => {
    const ids = [selectedMarket?._id, selectedMarket?.id, selectedMarket?.marketsOld]
        .filter(Boolean)
        .map(String);

    return [...new Set(ids)];
};

const normalizeMarketHowWeDoItItems = (items = []) => {
    if (!Array.isArray(items)) return [];

    return items
        .map((item) => ({
            ...item,
            title: item?.title || item?.heading || item?.name || item?.label || "",
            description: item?.description || item?.content || item?.subtitle || "",
            image: resolveHowWeDoItImage(item),
        }))
        .filter((item) => item.title || item.description || item.image);
};

const fetchPayloadHowWeDoItDataForMarket = async (slug, { draft = false } = {}) => {
    try {
        const docs = await queryMarkets({
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 1,
            draft,
            select: { howWeDoIt: true },
        });

        if (!docs.length) return [];

        return normalizeMarketHowWeDoItItems(docs[0]?.howWeDoIt);
    } catch (error) {
        logError(`Error fetching payload how we do it data: ${error.message}`, error);
        return [];
    }
};

// SliderComponent reads portfolioRef.{title, slug, coverImage.imageInfo} only.
export const fetchPortfolioDataForMarkets = async (id) => {
    try {
        const payloadProjects = await queryProjects({
            where: { markets: { in: id } },
            sort: "order",
            limit: 20,
            depth: 1,
        });
        return payloadProjects.map(normalizePayloadProjectForHome);
    } catch (error) {
        logError(`Error fetching portfolio data: ${error.message}`, error);
        return [];
    }
};

export const fetchHowWeDoItDataForMarket = async () => [];

// HensleyNews/NewsCard reads only the slim blog shape (cover, title, date,
// author display name, market/studio/category refs). Drop content/excerpt/
// storeProducts hydration.
const fetchBlogsForMarketSlim = async (ids) => {
    try {
        const payloadBlogs = await queryBlogs({
            where: { markets: { in: ids } },
            depth: 1,
            select: {
                title: true,
                slug: true,
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
            },
        });
        return payloadBlogs.map(normalizePayloadBlogForHome);
    } catch (error) {
        logError(`Error fetching blogs for market: ${error.message}`, error);
        return [];
    }
};

// Slim best sellers fetch. Mirrors the homepage best-sellers variant — drops
// variants/productOptions/recommendedProducts/seo. ProductCard reads only
// title/sku/type/slug/mainMedia/ribbon; AddToCart refetches by id if it
// needs more.
const fetchBestSellersForMarket = async (collectionId) => {
    try {
        if (!collectionId) return [];
        const result = await queryProductsByCollectionIdsForHome([collectionId]);
        return Array.isArray(result?.docs) ? result.docs : [];
    } catch (error) {
        logError(`Error fetching market best sellers: ${error.message}`, error);
        return [];
    }
};

export const fetchSelectedMarketData = cache(async (slug, { draft = false } = {}) => {
    try {
        const marketsData = await fetchMarketsData({ draft });

        const selectedMarket = marketsData.find((market) => market.slug === `/${slug}`);
        // Genuine "no such market" — return null so the page renders notFound().
        // (A thrown error here would be a transient failure, handled in catch.)
        if (!selectedMarket) {
            return null;
        }
        const bestSellerCollection = selectedMarket?.bestSellerCollection;

        const otherMarketsData = marketsData.filter((market) => market.slug !== `/${slug}`);

        const ids = buildMarketLookupIds(selectedMarket);
        const marketHowWeDoItData = normalizeMarketHowWeDoItItems(selectedMarket?.howWeDoIt);

        const [portfolioData, payloadHowWeDoItData, bannerData, testimonials, blogsData, bestSellerProducts, marketPageDetails] = await Promise.all([
            fetchPortfolioDataForMarkets(ids),
            marketHowWeDoItData.length ? Promise.resolve([]) : fetchPayloadHowWeDoItDataForMarket(slug, { draft }),
            fetchBannerData(),
            fetchTestimonials(),
            fetchBlogsForMarketSlim(ids),
            fetchBestSellersForMarket(bestSellerCollection),
            fetchMarketPageDetails(),
        ]);

        const response = {
            otherMarketsData: otherMarketsData || [],
            selectedMarket,
            bannerData,
            portfolioData: portfolioData || [],
            howWeDoItData: marketHowWeDoItData.length
                ? marketHowWeDoItData
                : (payloadHowWeDoItData.length ? payloadHowWeDoItData : []),
            bestSellers: bestSellerProducts || [],
            testimonials: testimonials || [],
            blogsData: blogsData || [],
            marketPageDetails: marketPageDetails || {},
        };
        return response;
    } catch (error) {
        logError(`Error fetching selected market data: ${error.message}`, error);
        // Transient/upstream failure — re-throw so Next renders an error page
        // (retried on reload) instead of caching a false 404.
        throw error;
    }
});

