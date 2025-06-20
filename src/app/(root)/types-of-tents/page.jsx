import Tents from "@/components/Tents";
import { fetchPageMetaData, fetchTentListingPageDetails, fetchTentsData, fetchTentsWithProjectsAndBlogs } from "@/services"; // multiple services
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


export default async function Page({ params }) {
  try {

    const projectandblog = await fetchTentsWithProjectsAndBlogs();

    const [tents, pageDetails] = await Promise.all([
      fetchTentsData(),
      fetchTentListingPageDetails()
    ]);

    const data = {
      tents,
      projectandblog,
      pageDetails
    };

    return <Tents data={data}/>
    // return <h1>Hello World</h1>

  } catch (error) {
    logError("Error fetching product page data:", error);
    notFound();
  }
}
