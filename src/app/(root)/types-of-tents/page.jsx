import Tents from "@/components/Tents";
import { fetchFeaturedBlogs, fetchFeaturedProjects, fetchMasterClassTenting, fetchPageMetaData, fetchTentListingPageDetails, fetchTentsDataForListing } from "@/services";
import { logError } from "@/utils";
import { notFound } from "next/navigation";


export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("types-of-tents");
    const { title, robotsTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && robotsTag) metadata.robots = robotsTag;
    return metadata;
  } catch (error) {
    logError("Error in metadata(typesTent page):", error);
  }
}


export default async function Page() {
  try {
    const [tents, pageDetails, masterClassTentingURL] = await Promise.all([
      fetchTentsDataForListing(),
      fetchTentListingPageDetails(),
      fetchMasterClassTenting()
    ]);

    const fullTentData = await Promise.all(
      tents.map(async (item) => {
        const tentData = item;

        const [featuredProjects, blogs] = await Promise.all([
          fetchFeaturedProjects(item.tent?._id),
          fetchFeaturedBlogs(item.tent?._id),
        ]);

        return {
          tentData,
          portfolio: featuredProjects,
          blogs,
        };
      })
    );

    const data = {
      tents,
      fullTentData,
      pageDetails,
      masterClassTentingURL
    };

    return <Tents data={data} />

  } catch (error) {
    logError("Error fetching product page data:", error);
    notFound();
  }
}
