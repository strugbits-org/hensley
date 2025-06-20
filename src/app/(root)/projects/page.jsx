import Portfolio from "@/components/Portfolio";
import { fetchPageMetaData } from "@/services";
import { fetchPortfolioPageData } from "@/services/projects";
import { logError } from "@/utils";
import { notFound } from "next/navigation";


export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("projects");
    const { title, noFollowTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) metadata.robots = "noindex,nofollow";
    return metadata;
  } catch (error) {
    logError("Error in metadata(projecting page):", error);
  }
}


export default async function Page() {
  try {
    const data = await fetchPortfolioPageData();

    return (
      <Portfolio data={data} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
