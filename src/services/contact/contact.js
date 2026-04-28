"use server";

import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { mapStorefrontFooterBranches, queryStorefrontFooter } from "../payloadCollections";

export const fetchContactPageData = async () => {
    try {
        const [contactFormData, storefrontFooter] = await Promise.all([
            queryCollection({ dataCollectionId: "ContactForm" }),
            queryStorefrontFooter({ channel: "hensley", key: "default" }),
        ]);

        if (!Array.isArray(contactFormData.items)) {
            throw new Error(`ContactForm response does not contain items array`);
        }

        const footerBranches = mapStorefrontFooterBranches(storefrontFooter);

        if (footerBranches.length) {
            return {
                contactFormData: contactFormData.items[0],
                branchesData: footerBranches,
            };
        }

        const branchesData = await queryCollection({ dataCollectionId: "Branches" });

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
