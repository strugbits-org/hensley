import Tents from "@/components/Tents";
import { fetchMasterClassTenting, fetchPageMetaData, fetchTentListingPageDetails, fetchTentsData, fetchTentsWithProjectsAndBlogs } from "@/services"; // multiple services
import { logError } from "@/utils";
import { notFound } from "next/navigation";


export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("types-of-tents");
    const { title, noFollowTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) metadata.robots = "noindex,nofollow";
    return metadata;
  } catch (error) {
    logError("Error in metadata(typesTent page):", error);
  }
}


export default async function Page() {
  try {

    const projectAndblog = await fetchTentsWithProjectsAndBlogs();

    const [tents, pageDetails, masterClassTentingURL] = await Promise.all([
      fetchTentsData(),
      fetchTentListingPageDetails(),
      fetchMasterClassTenting()
    ]);

    const data = {
      tents,
      projectAndblog,
      pageDetails,
      masterClassTentingURL
    };

    return <Tents data={data} />

  } catch (error) {
    logError("Error fetching product page data:", error);
    notFound();
  }
}
