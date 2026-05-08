import { logError } from "@/utils";
import { fetchBannerData, fetchBestSellers, fetchBlogsData, fetchMarketsData, fetchTestimonials } from "..";
import { fetchProductsByCategory } from "../products";
import {
    queryProjects,
    queryBlogs,
    queryMarkets,
    querySection,
    sectionToObject,
    normalizePayloadProject,
    normalizePayloadBlog,
} from "../payloadCollections";

const fallbackMarketPageDetails = {
    bestSellerTitle: "BEST SELLERS",
    marketsTitle: "OUR MARKETS",
    howWeDoItTitle: "HOW WE DO IT",
    testimonialsTitle: "WHAT PEOPLE SAY",
    hensleyNewsTitle: "HENSLEY NEWS",
    buttonLabelPortfolioSlider: "OUR PROJECTS",
};

export const fetchMarketPageDetails = async () => {
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
};

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

const fetchPayloadHowWeDoItDataForMarket = async (slug) => {
    try {
        const docs = await queryMarkets({
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 1,
        });

        if (!docs.length) return [];

        return normalizeMarketHowWeDoItItems(docs[0]?.howWeDoIt);
    } catch (error) {
        logError(`Error fetching payload how we do it data: ${error.message}`, error);
        return [];
    }
};

export const fetchPortfolioDataForMarkets = async (id) => {
    try {
        const payloadProjects = await queryProjects({
            where: { markets: { in: id } },
            sort: "order",
        });
        return payloadProjects.map(normalizePayloadProject);
    } catch (error) {
        logError(`Error fetching portfolio data: ${error.message}`, error);
        return [];
    }
};

export const fetchHowWeDoItDataForMarket = async () => [];

export const fetchSelectedMarketData = async (slug) => {
    try {
        const marketsData = await fetchMarketsData();

        const selectedMarket = marketsData.find((market) => market.slug === `/${slug}`);
        const bestSellerCollection = selectedMarket?.bestSellerCollection;

        const otherMarketsData = marketsData.filter((market) => market.slug !== `/${slug}`);
        if (!selectedMarket) {
            throw new Error("Market not found");
        }

        const ids = buildMarketLookupIds(selectedMarket);
        const marketHowWeDoItData = normalizeMarketHowWeDoItItems(selectedMarket?.howWeDoIt);

        const [portfolioData, payloadHowWeDoItData, bannerData, testimonials, blogsData, bestSellerProducts, marketPageDetails] = await Promise.all([
            fetchPortfolioDataForMarkets(ids),
            marketHowWeDoItData.length ? Promise.resolve([]) : fetchPayloadHowWeDoItDataForMarket(slug),
            fetchBannerData(),
            fetchTestimonials(),
            fetchBlogsForMarket(ids),
            fetchProductsByCategory(bestSellerCollection),
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
    }
}

export const fetchBlogsForMarket = async (ids) => {
    try {
        const payloadBlogs = await queryBlogs({
            where: { markets: { in: ids } },
            sort: "order",
        });
        return payloadBlogs.map(normalizePayloadBlog);
    } catch (error) {
        logError(`Error fetching blogs for market: ${error.message}`, error);
        return [];
    }
}