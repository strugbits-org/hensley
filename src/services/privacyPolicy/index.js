"use server";

import { logError } from "@/utils";
import { querySection, sectionToObject } from "@/services/payloadCollections";

export const fetchPrivacyPolicyPageData = async ({ draft = false } = {}) => {
  try {
    const section = await querySection('privacy-policy-content', { draft });
    const privacyData = sectionToObject(section);

    return { privacyData };
  } catch (error) {
    logError(`Error fetching privacy policy page data: ${error.message}`, error);
  }
};
