"use server";

import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const fetchPrivacyPolicyPageData = async () => {
  try {
    const privacyData = await queryCollection({ dataCollectionId: "PrivacyPolicy" });

    if (!Array.isArray(privacyData.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return {
      privacyData: privacyData.items[0],
    };

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};
