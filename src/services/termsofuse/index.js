"use server";

import { logError } from "@/utils";
import { querySection, sectionToObject } from "@/services/payloadCollections";

export const fetchTermsConditionsPageData = async ({ draft = false } = {}) => {
  try {
    const section = await querySection('terms-and-conditions-content', { draft });
    const termsData = sectionToObject(section);

    return { termsData };
  } catch (error) {
    logError(`Error fetching terms and conditions page data: ${error.message}`, error);
  }
};
