"use server";

import { logError } from "@/utils";
import { querySection, queryProductCollections, sectionToObject } from "@/services/payloadCollections";
import {
  fetchBannerData,
  fetchBestSellersForHome,
  fetchBlogsDataForHome,
  fetchHomePageDetails,
  fetchMarketsForHome,
  fetchOurCategoriesData,
  fetchPortfolioDataForHome,
  fetchTestimonials,
} from "..";

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
      blogsData,
      allCollections,
    ] = await Promise.all([
      fetchBannerData(),
      querySection('home-hero'),
      fetchHomePageDetails(),
      fetchOurCategoriesData(),
      fetchPortfolioDataForHome(),
      fetchBestSellersForHome(),
      fetchTestimonials(),
      fetchMarketsForHome(),
      fetchBlogsDataForHome(),
      queryProductCollections(),
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
      blogsData,
      allCollections: Array.isArray(allCollections) ? allCollections : [],
    };

    return response;
  } catch (error) {
    logError(`Error fetching hero section data: ${error.message}`, error);
    // Return a safe shape so the page renders (mostly empty) instead of crashing
    // when a sub-fetch fails. Each child component also guards its own props.
    return {
      heroSectionData: null,
      bannerData: null,
      homePageDetails: {},
      categoriesData: [],
      portfolioData: [],
      bestSellers: [],
      testimonials: [],
      marketsData: [],
      blogsData: [],
      allCollections: [],
    };
  }
};