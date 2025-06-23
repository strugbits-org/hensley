import PrivacyPolicy from "@/components/PrivacyPolicy";
import { fetchPageMetaData } from "@/services";
import { fetchPrivacyPolicyPageData } from "@/services/privacyPolicy";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("privacy-policy");
    const { title, noFollowTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) metadata.robots = "noindex,nofollow";
    return metadata;
  } catch (error) {
    logError("Error in metadata(home page):", error);
  }
}

export default async function Page() {
  try {
    const response = await fetchPrivacyPolicyPageData();
    const { privacyData } = response;
    return (
      <PrivacyPolicy data={privacyData} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
};