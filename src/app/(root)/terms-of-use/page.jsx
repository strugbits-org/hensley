import TermsOfUse from "@/components/TermsOfUse";
import { fetchPageMetaData } from "@/services";
import { fetchTermsConditionsPageData } from "@/services/termsofuse";
import { logError } from "@/utils";
import { notFound } from "next/navigation";


export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("terms-of-use");
    const { title, robotsTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && robotsTag) metadata.robots = robotsTag;
    return metadata;
  } catch (error) {
    logError("Error in metadata(home page):", error);
  }
}



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