"use server";

import { logError } from "@/utils";
import { querySection, sectionToObject } from "@/services/payloadCollections";

export const fetchCareersPageData = async () => {
    try {
        const [
            careersHeroSection,
            howWeDoItSection,
            careersWhoWorksSection,
        ] = await Promise.all([
            querySection('careers-hero'),
            querySection('how-we-do-it'),
            querySection('careers-who-works'),
        ]);

        const heroSectionData = sectionToObject(careersHeroSection);
        const howWeDoItFields = sectionToObject(howWeDoItSection);
        const whoWorksFields = sectionToObject(careersWhoWorksSection);

        const response = {
            heroSectionData,
            howWeDoItData: howWeDoItFields.items || [],
            whoWorksCareersPageData: whoWorksFields.testimonials || [],
            lastSectionCareersPageData: {},
            jobsData: [],
        };

        return response;

    } catch (error) {
        logError(`Error fetching careers page data: ${error.message}`, error);
    }
};
