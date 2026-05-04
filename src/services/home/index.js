"use server";

import { logError } from "@/utils";
import { querySection, sectionToObject } from "@/services/payloadCollections";
import { fetchBannerData, fetchBestSellers, fetchBlogsData, fetchHomePageDetails, fetchMarketsData, fetchOurCategoriesData, fetchPortfolioData, fetchTestimonials } from "..";

export const fetchHomePageData = async () => {
  try {
    const [
      bannerData,
      heroSection,
      homePageDetails,
      categoriesData,
      portfolioData,
      bestSellers,
      testimonials,
      marketsData,
      blogsData
    ] = await Promise.all([
      fetchBannerData(),
      querySection('home-hero'),
      fetchHomePageDetails(),
      fetchOurCategoriesData(),
      fetchPortfolioData(),
      fetchBestSellers(),
      fetchTestimonials(),
      fetchMarketsData(),
      fetchBlogsData(),
    ]);

    const heroSectionData = sectionToObject(heroSection);

    if (!homePageDetails || !categoriesData || !portfolioData || !bestSellers) {
      throw new Error(`Response does not contain required data`);
    }

    const response = {
      heroSectionData,
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