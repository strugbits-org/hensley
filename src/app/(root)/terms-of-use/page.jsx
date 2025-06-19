import PrivacyPolicy from "@/components/PrivacyPolicy";
import TermsOfUse from "@/components/TermsOfUse";
import { fetchTermsConditionsPageData } from "@/services/termsofuse";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const response = await fetchTermsConditionsPageData();

    console.log("new response: ",response)

    const {termsData} = response

    return (
        <TermsOfUse data={termsData}/>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
};