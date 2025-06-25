"use server";

import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchContactPageData = async () => {
    try {
        const [contactFormData, branchesData] = await Promise.all([
            queryCollection({ dataCollectionId: "ContactForm" }),
            queryCollection({ dataCollectionId: "Branches" }),
        ]);

        // Validate collections
        if (!Array.isArray(contactFormData.items)) {
            throw new Error(`ContactForm response does not contain items array`);
        }

        if (!Array.isArray(branchesData.items)) {
            throw new Error(`Branches response does not contain items array`);
        }

        return {
            contactFormData: contactFormData.items[0],
            branchesData: branchesData.items,
        };

    } catch (error) {
        logError(`Error fetching contact page data: ${error.message}`, error);
    }
};
