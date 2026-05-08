"use server";

import { logError } from "@/utils";
import { mapStorefrontFooterBranches, queryStorefrontFooter, querySection, sectionToObject } from "../payloadCollections";

const fallbackContactFormData = {
    title: "Send your message",
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    phoneLabel: "Phone Number",
    emailLabel: "Email",
    messageLabel: "Message",
    submitButtonLabel: "Send Message",
};

export const fetchContactPageData = async () => {
    try {
        const [storefrontFooter, contactSection] = await Promise.all([
            queryStorefrontFooter({ channel: "her", key: "default" }),
            querySection('contact-form-labels'),
        ]);
        const footerBranches = mapStorefrontFooterBranches(storefrontFooter);
        const contactFormData = contactSection
            ? sectionToObject(contactSection)
            : fallbackContactFormData;

        return {
            contactFormData,
            branchesData: footerBranches.length ? footerBranches : [],
        };
    } catch (error) {
        logError(`Error fetching contact page data: ${error.message}`, error);
        return { contactFormData: fallbackContactFormData, branchesData: [] };
    }
};
