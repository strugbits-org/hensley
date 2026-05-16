"use server";

import { cache } from "react";
import { logError } from "@/utils";
import { querySection, sectionToObject, queryProjects, normalizePayloadProjectForHome, queryHowWeDoIt, queryDreamTeamMembers, queryPartnerBrands } from "@/services/payloadCollections";

// About slider only reads portfolioRef.{title, slug, coverImage.imageInfo}.
// Uses the same slim normalizer as the homepage. Limited to 20 because the
// slider doesn't paginate.
const fetchPortfolioItemsForAbout = async () => {
  try {
    const payloadProjects = await queryProjects({ sort: "order", limit: 20 });
    return payloadProjects.map(normalizePayloadProjectForHome);
  } catch (error) {
    logError(`Error fetching portfolio items (about): ${error.message}`, error);
    return [];
  }
};


export const fetchAboutPageData = cache(async () => {
  try {
    const [
      aboutPageLabelsSection,
      aboutHeroSection,
      dreamTeamData,
      partnerBrandsData,
      howWeDoItData,
      portfolioData,
    ] = await Promise.all([
      querySection('about-page-labels'),
      querySection('about-hero'),
      queryDreamTeamMembers(),
      queryPartnerBrands(),
      queryHowWeDoIt(),
      fetchPortfolioItemsForAbout(),
    ]);

    const aboutPageDetails = sectionToObject(aboutPageLabelsSection);
    const heroSectionData = sectionToObject(aboutHeroSection);

    const response = {
      aboutPageDetails,
      heroSectionData,
      dreamTeamData: dreamTeamData || [],
      familySectionData: partnerBrandsData || [],
      howWeDoItData: howWeDoItData || [],
      portfolioData: portfolioData || [],
    };

    return response;
  } catch (error) {
    logError(`Error fetching about page data: ${error.message}`, error);
  }
});
