import Portfolio from "@/components/Portfolio";
import { fetchPageMetaData } from "@/services";
import { fetchPortfolioPageData } from "@/services/projects";
import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";


export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("projects");
    const metadata = {};
    if (metaData?.title) metadata.title = metaData.title;
    if (process.env.ENVIRONMENT === "PRODUCTION" && metaData?.robotsTag) {
      metadata.robots = metaData.robotsTag;
    }
    return metadata;
  } catch (error) {
    logError("Error in metadata(projecting page):", error);
  }
}


export default async function Page() {
  try {
    const data = await fetchPortfolioPageData();

    return (
      <Suspense>
        <Portfolio data={data} />
      </Suspense>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
