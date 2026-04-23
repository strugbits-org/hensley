import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchBannerData, fetchBestSellers, fetchBlogsData, fetchMarketsData, fetchTestimonials } from "..";
import { fetchProductsByCategory } from "../products";
import {
    queryProjects,
    queryBlogs,
    queryMarkets,
    normalizePayloadProject,
    normalizePayloadBlog,
} from "../payloadCollections";

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
        // Payload-first
        const payloadProjects = await queryProjects({
            where: { markets: { in: id } },
            sort: "order",
        });
        if (payloadProjects.length) {
            return payloadProjects.map(normalizePayloadProject);
        }

        // Wix fallback
        const response = await queryCollection({
            dataCollectionId: "PortfolioCollection",
            includeReferencedItems: ["portfolioRef"],
            ne: [
                {
                    key: "isHidden",
                    value: true
                }
            ],
            hasSome: [
                {
                    key: "markets",
                    values: id
                }
            ],
            sortKey: "order"
        });

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        return response.items;
    } catch (error) {
        logError(`Error fetching portfolio data: ${error.message}`, error);
    }
};

export const fetchHowWeDoItDataForMarket = async (id) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "HowWeDoItMarkets",
            hasSome: [
                {
                    key: "markets",
                    values: id
                }
            ],
            sortKey: "orderNumber"
        });

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }

        const normalizedItems = normalizeMarketHowWeDoItItems(response.items);
        if (normalizedItems.length) {
            return normalizedItems;
        }

        // Some legacy datasets are not linked to market references.
        const fallbackResponse = await queryCollection({
            dataCollectionId: "HowWeDoItMarkets",
            sortKey: "orderNumber"
        });

        if (!Array.isArray(fallbackResponse.items)) {
            throw new Error(`Fallback response does not contain items array`);
        }

        return normalizeMarketHowWeDoItItems(fallbackResponse.items);
    } catch (error) {
        logError(`Error fetching how we do it data: ${error.message}`, error);
        return [];
    }
}

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

        const [portfolioData, payloadHowWeDoItData, legacyHowWeDoItData, bannerData, testimonials, blogsData, bestSellerProducts, marketPageDetails] = await Promise.all([
            fetchPortfolioDataForMarkets(ids),
            marketHowWeDoItData.length ? Promise.resolve([]) : fetchPayloadHowWeDoItDataForMarket(slug),
            marketHowWeDoItData.length ? Promise.resolve([]) : fetchHowWeDoItDataForMarket(ids),
            fetchBannerData(),
            fetchTestimonials(),
            fetchBlogsForMarket(ids),
            fetchProductsByCategory(bestSellerCollection),
            queryCollection({ dataCollectionId: "MarketPageDetails" }),
        ]);


        const response = {
            otherMarketsData: otherMarketsData || [],
            selectedMarket,
            bannerData,
            portfolioData: portfolioData || [],
            howWeDoItData: marketHowWeDoItData.length
                ? marketHowWeDoItData
                : (payloadHowWeDoItData.length ? payloadHowWeDoItData : (legacyHowWeDoItData || [])),
            bestSellers: bestSellerProducts || [],
            testimonials: testimonials || [],
            blogsData: blogsData || [],
            marketPageDetails: marketPageDetails?.items[0] || {},
        };
        return response;
    } catch (error) {
        logError(`Error fetching selected market data: ${error.message}`, error);
    }
}

export const fetchBlogsForMarket = async (ids) => {
    try {
        // Payload-first
        const payloadBlogs = await queryBlogs({
            where: { markets: { in: ids } },
            sort: "order",
        });
        if (payloadBlogs.length) {
            return payloadBlogs.map(normalizePayloadBlog);
        }

        // Wix fallback
        const response = await queryCollection({
            dataCollectionId: "ManageBlogs",
            includeReferencedItems: ["blogRef", "author", "markets", "studios"],
            hasSome: [
                {
                    key: "markets",
                    values: ids
                }
            ],
            sortKey: "order"
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }
        return response.items;
    } catch (error) {
        logError(`Error fetching blogs for market: ${error.message}`, error);
    }
}