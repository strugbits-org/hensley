"use server";

import { logError } from "@/utils";
import { querySection, sectionToObject, queryProjects, normalizePayloadProject, queryHowWeDoIt, queryDreamTeamMembers, queryPartnerBrands } from "@/services/payloadCollections";

const fetchPortfolioItems = async () => {
  try {
    const payloadProjects = await queryProjects({ sort: "order" });
    return payloadProjects.map(normalizePayloadProject);
  } catch (error) {
    logError(`Error fetching portfolio items: ${error.message}`, error);
    return [];
  }
};


export const fetchAboutPageData = async () => {
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
      fetchPortfolioItems(),
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
};
