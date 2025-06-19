"use server";

import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchTermsConditionsPageData = async () => {
  try {
    const termsData = await queryCollection({ dataCollectionId: "TermsConditions" });

    if (!Array.isArray(termsData.items)) {
      throw new Error(`TermsConditions response does not contain items array`);
    }

    return {
      termsData: termsData.items[0],
    };

  } catch (error) {
    logError(`Error fetching terms and conditions page data: ${error.message}`, error);
  }
};
