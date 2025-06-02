"use server";

import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchAboutPageData = async () => {
  try {
    const [
      heroSectionData,
    ] = await Promise.all([
      queryCollection({ dataCollectionId: "HeroSectionAboutPage" }),
    ]);

    if (!Array.isArray(heroSectionData.items)) {
      throw new Error(`Response does not contain items array`);
    }

    const response = {
      heroSectionData: heroSectionData.items[0],
    };

    return response;
  } catch (error) {
    logError(`Error fetching hero section data: ${error.message}`, error);
  }
};