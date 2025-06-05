"use server";

import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchCareersPageData = async () => {
    try {
        const [
            heroSectionData,
            howWeDoItData,
            whoWorksCareersPageData,
            lastSectionCareersPageData,
            jobsData,
        ] = await Promise.all([
            queryCollection({ dataCollectionId: "HeroSectionCareersPage" }),
            queryCollection({ dataCollectionId: "HowWeDoIt" }),
            queryCollection({ dataCollectionId: "WhoWorksCareersPage" }),
            queryCollection({ dataCollectionId: "LastSectionCareersPage" }),
            queryCollection({ dataCollectionId: "JOBS" }),
        ]);

        // Validate collections
        if (!Array.isArray(heroSectionData.items)) {
            throw new Error(`HeroSection response does not contain items array`);
        }

        if (!Array.isArray(howWeDoItData.items)) {
            throw new Error(`HowWeDoIt response does not contain items array`);
        }

        if (!Array.isArray(whoWorksCareersPageData.items)) {
            throw new Error(`WhoWorksCareersPage response does not contain items array`);
        }

        if (!Array.isArray(lastSectionCareersPageData.items)) {
            throw new Error(`LastSectionCareersPage response does not contain items array`);
        }

        if (!Array.isArray(jobsData.items)) {
            throw new Error(`JOBS response does not contain items array`);
        }

        const response = {
            heroSectionData: heroSectionData.items[0],
            howWeDoItData: howWeDoItData.items,
            whoWorksCareersPageData: whoWorksCareersPageData.items,
            lastSectionCareersPageData: lastSectionCareersPageData.items[0], // assuming only one object
            jobsData: jobsData.items,
        };

        return response;

    } catch (error) {
        logError(`Error fetching careers page data: ${error.message}`, error);
    }
};
