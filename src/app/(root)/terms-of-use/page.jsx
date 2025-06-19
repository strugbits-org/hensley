import TermsOfUse from "@/components/TermsOfUse";
import { fetchTermsConditionsPageData } from "@/services/termsofuse";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    const response = await fetchTermsConditionsPageData();
    const {termsData} = response

    return (
        <TermsOfUse data={termsData}/>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
};