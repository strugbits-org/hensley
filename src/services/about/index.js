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
    if (!Array.isArray(heroSectionData.items)) {
      throw new Error(`HeroSection response does not contain items array`);
    }

    if (!Array.isArray(dreamTeamData.items)) {
      throw new Error(`DreamTeam response does not contain items array`);
    }

    if (!Array.isArray(familySectionData.items)) {
      throw new Error(`FamilySection response does not contain items array`);
    }

    if (!Array.isArray(howWeDoItData.items)) {
      throw new Error(`HowWeDoIt response does not contain items array`);
    }

    if (!Array.isArray(portfolioData.items)) {
      throw new Error(`PortfolioCollection response does not contain items array`);
    }

    const response = {
      heroSectionData: heroSectionData.items[0],
      dreamTeamData: dreamTeamData.items,
      familySectionData: familySectionData.items,
      howWeDoItData: howWeDoItData.items,
      portfolioData: portfolioData.items,
    };

    // Optional logs for debugging
    // console.log("--hero section---", heroSectionData.items[0]);
    // console.log("--dream team---", dreamTeamData.items);
    // console.log("--family section---", familySectionData.items);
    // console.log("--how we do it---", howWeDoItData.items);
    // console.log("--portfolio---", portfolioData.items);

    return response;
  } catch (error) {
    logError(`Error fetching about page data: ${error.message}`, error);
  }
};
