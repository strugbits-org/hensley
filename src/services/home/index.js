"use server";

import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchBannerData, fetchBestSellers, fetchBlogsData, fetchHomePageDetails, fetchMarketsData, fetchOurCategoriesData, fetchPortfolioData, fetchTestimonials } from "..";

export const fetchHomePageData = async () => {
  try {
    const [
      bannerData,
      heroSectionData,
      homePageDetails,
      categoriesData,
      portfolioData,
      bestSellers,
      testimonials,
      marketsData,
      blogsData
    ] = await Promise.all([
      fetchBannerData(),
      queryCollection({ dataCollectionId: "HeroSectionDataHome" }),
      fetchHomePageDetails(),
      fetchOurCategoriesData(),
      fetchPortfolioData(),
      fetchBestSellers(),
      fetchTestimonials(),
      fetchMarketsData(),
      fetchBlogsData(),
    ]);

    if (!Array.isArray(heroSectionData.items) || !homePageDetails || !categoriesData || !portfolioData || !bestSellers) {
      throw new Error(`Response does not contain items array`);
    }

    const response = {
      heroSectionData: heroSectionData.items[0],
      bannerData,
      homePageDetails,
      categoriesData,
      portfolioData,
      bestSellers,
      testimonials,
      marketsData,
      blogsData
    };

    return response;
  } catch (error) {
    logError(`Error fetching hero section data: ${error.message}`, error);
  }
};