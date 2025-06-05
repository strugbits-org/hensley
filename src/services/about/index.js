"use server";

import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchAboutPageData = async () => {
  try {
    const [
      heroSectionData,
      dreamTeamData,
      familySectionData,
      howWeDoItData,
      portfolioData,
    ] = await Promise.all([
      queryCollection({ dataCollectionId: "HeroSectionAboutPage" }),
      queryCollection({ dataCollectionId: "DREAMTEAM" }),
      queryCollection({ dataCollectionId: "FamilySection" }),
      queryCollection({ dataCollectionId: "HowWeDoIt" }),
      queryCollection({ dataCollectionId: "PortfolioCollection" }),
    ]);

    // Validate all collections
    if (!Array.isArray(heroSectionData.items) || !Array.isArray(dreamTeamData.items) || !Array.isArray(familySectionData.items) || !Array.isArray(howWeDoItData.items) || !Array.isArray(portfolioData.items)) {
      throw new Error(`response does not contain items array`);
    }

    const response = {
      heroSectionData: heroSectionData.items[0],
      dreamTeamData: dreamTeamData.items,
      familySectionData: familySectionData.items,
      howWeDoItData: howWeDoItData.items,
      portfolioData: portfolioData.items,
    };

    return response;
  } catch (error) {
    logError(`Error fetching about page data: ${error.message}`, error);
  }
};
