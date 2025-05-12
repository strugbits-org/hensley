"use server";

import { logError, sortByOrderNumber } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchHomePageData = async () => {
  try {
    const [
      homePageDetails,
      heroSectionData,
      categoriesData,
    ] = await Promise.all([
      queryCollection({ dataCollectionId: "HomePageDetails" }),
      queryCollection({ dataCollectionId: "HeroSectionDataHome" }),
      queryCollection({ dataCollectionId: "OurCategories", includeReferencedItems: ["categories"] }),
    ]);

    if (!Array.isArray(homePageDetails.items) || !Array.isArray(heroSectionData.items) || !Array.isArray(categoriesData.items)) {
      throw new Error(`Response does not contain items array`);
    }

    const response = {
      homePageDetails: homePageDetails.items[0],
      heroSectionData: heroSectionData.items[0],
      categoriesData: sortByOrderNumber(categoriesData.items),
    };

    return response;
  } catch (error) {
    logError(`Error fetching hero section data: ${error.message}`, error);
  }
};