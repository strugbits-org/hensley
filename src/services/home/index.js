"use server";

import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { fetchBestSellers, fetchHomePageDetails, fetchOurCategoriesData, fetchPortfolioData, fetchTestimonials } from "..";

export const fetchHomePageData = async () => {
  try {
    const [
      bannerData,
      heroSectionData,
      homePageDetails,
      categoriesData,
      portfolioData,
      bestSellers,
      testimonials
    ] = await Promise.all([
      queryCollection({ dataCollectionId: "BannerHomePage" }),
      queryCollection({ dataCollectionId: "HeroSectionDataHome" }),
      fetchHomePageDetails(),
      fetchOurCategoriesData(),
      fetchPortfolioData(),
      fetchBestSellers(),
      fetchTestimonials()
    ]);

    if (!Array.isArray(heroSectionData.items) || !homePageDetails || !categoriesData || !portfolioData || !bestSellers) {
      throw new Error(`Response does not contain items array`);
    }

    const response = {
      bannerData: bannerData.items[0],
      heroSectionData: heroSectionData.items[0],
      homePageDetails,
      categoriesData,
      portfolioData,
      bestSellers,
      testimonials
    };

    return response;
  } catch (error) {
    logError(`Error fetching hero section data: ${error.message}`, error);
  }
};