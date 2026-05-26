"use server";

import { logError } from "@/utils";
import { mapSectionAddressLocations, querySection, sectionToObject } from "../payloadCollections";

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
        const contactSection = await querySection('contact-form-labels');
        const contactFormData = contactSection
            ? sectionToObject(contactSection)
            : fallbackContactFormData;

        // Locations are referenced directly from the contact section's
        // `addresses` relationship (into the `locations` collection).
        const branchesData = mapSectionAddressLocations(contactFormData?.addresses);

        return {
            contactFormData,
            branchesData,
        };
    } catch (error) {
        logError(`Error fetching contact page data: ${error.message}`, error);
        return { contactFormData: fallbackContactFormData, branchesData: [] };
    }
};
