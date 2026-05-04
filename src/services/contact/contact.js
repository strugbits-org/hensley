"use server";

import { logError } from "@/utils";
import { mapStorefrontFooterBranches, queryStorefrontFooter } from "../payloadCollections";

const hardcodedContactFormData = {
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    phoneLabel: "Phone Number",
    emailLabel: "Email",
    messageLabel: "Message",
};

export const fetchContactPageData = async () => {
    try {
        const storefrontFooter = await queryStorefrontFooter({ channel: "hensley", key: "default" });
        const footerBranches = mapStorefrontFooterBranches(storefrontFooter);

        return {
            contactFormData: hardcodedContactFormData,
            branchesData: footerBranches.length ? footerBranches : [],
        };
    } catch (error) {
        logError(`Error fetching contact page data: ${error.message}`, error);
        return { contactFormData: hardcodedContactFormData, branchesData: [] };
    }
};
