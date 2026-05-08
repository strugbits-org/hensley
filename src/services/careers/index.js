"use server";

import { logError } from "@/utils";
import { querySection, sectionToObject, queryHowWeDoIt, queryTestimonialsByType } from "@/services/payloadCollections";

export const fetchCareersPageData = async () => {
    try {
        const [
            careersHeroSection,
            howWeDoItData,
            employeeTestimonialsData,
        ] = await Promise.all([
            querySection('careers-hero'),
            queryHowWeDoIt(),
            queryTestimonialsByType(undefined, 'employee'),
        ]);

        const heroSectionData = sectionToObject(careersHeroSection);

        const response = {
            heroSectionData,
            howWeDoItData: howWeDoItData || [],
            whoWorksCareersPageData: employeeTestimonialsData || [],
            lastSectionCareersPageData: {},
            jobsData: [],
        };

        return response;

    } catch (error) {
        logError(`Error fetching careers page data: ${error.message}`, error);
    }
};
