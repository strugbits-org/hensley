// "use server";

// import { logError } from "@/utils";
// import queryCollection from "@/utils/fetchFunction";

// export const fetchAboutPageData = async () => {
//   try {
//     const [
//       heroSectionData,
//       dreamTeamData,
//       familySectionData,
//       howWeDoItData,
//       portfolioData,
//     ] = await Promise.all([
//       queryCollection({ dataCollectionId: "AboutPageDetails" }),
//       queryCollection({ dataCollectionId: "HeroSectionAboutPage" }),
//       queryCollection({ dataCollectionId: "DREAMTEAM", sortKey: "order" }),
//       queryCollection({ dataCollectionId: "FamilySection" }),
//       queryCollection({ dataCollectionId: "HowWeDoIt" }),
//       queryCollection({ dataCollectionId: "PortfolioCollection" }),
//     ]);

//     // Validate all collections
//     if (!Array.isArray(heroSectionData.items) || !Array.isArray(dreamTeamData.items) || !Array.isArray(familySectionData.items) || !Array.isArray(howWeDoItData.items) || !Array.isArray(portfolioData.items)) {
//       throw new Error(`response does not contain items array`);
//     }

//     const response = {
//       heroSectionData: heroSectionData.items[0],
//       dreamTeamData: dreamTeamData.items,
//       familySectionData: familySectionData.items,
//       howWeDoItData: howWeDoItData.items,
//       portfolioData: portfolioData.items,
//     };

//     return response;
//   } catch (error) {
//     logError(`Error fetching about page data: ${error.message}`, error);
//   }
// };



"use server";

import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

const fetchPortfolioItems = async () => {
  try {
    const aboutCollectionId = "a3ad68c1-c76b-4aeb-858c-164fcabedfab";
    const portfolioIdsData = await queryCollection({
      dataCollectionId: "Portfolio/Projects",
      hasSome: [
        {
          key: "collectionIds",
          values: aboutCollectionId,
        },
      ],
    });
    const projectIds = portfolioIdsData.items.map(item => item._id);
    const response = await queryCollection({
      dataCollectionId: "PortfolioCollection",
      sortKey: "order",
      ne: [
        {
          key: "isHidden",
          value: true
        }
      ],
      hasSome: [
        {
          key: "projectId",
          values: projectIds
        }
      ]
    });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching portfolio items: ${error.message}`, error);
  }
}
export const fetchAboutPageData = async () => {
  try {
    const [
      aboutPageDetails,
      heroSectionData,
      dreamTeamData,
      familySectionData,
      howWeDoItData,
      portfolioData,
    ] = await Promise.all([
      queryCollection({ dataCollectionId: "AboutPageDetails" }),
      queryCollection({ dataCollectionId: "HeroSectionAboutPage" }),
      queryCollection({ dataCollectionId: "DREAMTEAM", sortKey: "order" }),
      queryCollection({ dataCollectionId: "FamilySection" }),
      queryCollection({ dataCollectionId: "HowWeDoIt" }),
      fetchPortfolioItems(),
    ]);

    // Validate all collections
    if (
      !Array.isArray(aboutPageDetails.items) ||
      !Array.isArray(heroSectionData.items) ||
      !Array.isArray(dreamTeamData.items) ||
      !Array.isArray(familySectionData.items) ||
      !Array.isArray(howWeDoItData.items)
    ) {
      throw new Error(`response does not contain items array`);
    }

    const response = {
      aboutPageDetails: aboutPageDetails.items[0],
      heroSectionData: heroSectionData.items[0],
      dreamTeamData: dreamTeamData.items,
      familySectionData: familySectionData.items,
      howWeDoItData: howWeDoItData.items,
      portfolioData: portfolioData,
    };

    return response;
  } catch (error) {
    logError(`Error fetching about page data: ${error.message}`, error);
  }
};
