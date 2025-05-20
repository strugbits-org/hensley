import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchBannerData, fetchBestSellers, fetchBlogsData, fetchMarketsData, fetchTestimonials } from "..";
import { fetchProductsByCategory } from "../products";

export const fetchPortfolioDataForMarkets = async (id) => {
    try {
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

        return response.items;
    } catch (error) {
        logError(`Error fetching how we do it data: ${error.message}`, error);
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

        const ids = [selectedMarket?._id];

        const [portfolioData, howWeDoItData, bannerData, testimonials, blogsData, bestSellerProducts, marketPageDetails] = await Promise.all([
            fetchPortfolioDataForMarkets(ids),
            fetchHowWeDoItDataForMarket(ids),
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
            howWeDoItData: howWeDoItData || [],
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