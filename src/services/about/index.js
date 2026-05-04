"use server";

import { logError } from "@/utils";
import { querySection, sectionToObject, queryProjects, normalizePayloadProject } from "@/services/payloadCollections";

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
      aboutDreamTeamSection,
      aboutMeetFamilySection,
      howWeDoItSection,
      portfolioData,
    ] = await Promise.all([
      querySection('about-page-labels'),
      querySection('about-hero'),
      querySection('about-dream-team'),
      querySection('about-meet-family'),
      querySection('how-we-do-it'),
      fetchPortfolioItems(),
    ]);

    const aboutPageDetails = sectionToObject(aboutPageLabelsSection);
    const heroSectionData = sectionToObject(aboutHeroSection);
    const dreamTeamFields = sectionToObject(aboutDreamTeamSection);
    const familyFields = sectionToObject(aboutMeetFamilySection);
    const howWeDoItFields = sectionToObject(howWeDoItSection);

    const response = {
      aboutPageDetails,
      heroSectionData,
      dreamTeamData: dreamTeamFields.team || [],
      familySectionData: familyFields.family || [],
      howWeDoItData: howWeDoItFields.items || [],
      portfolioData: portfolioData || [],
    };

    return response;
  } catch (error) {
    logError(`Error fetching about page data: ${error.message}`, error);
  }
};
