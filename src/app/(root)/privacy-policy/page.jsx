import PrivacyPolicy from "@/components/PrivacyPolicy";
import { fetchPrivacyPolicyPageData } from "@/services/privacyPolicy";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const response = await fetchPrivacyPolicyPageData();
    const {privacyData} = response;

    console.log("Response is new-: ",privacyData);
    return (
        <PrivacyPolicy data={privacyData}/>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
};