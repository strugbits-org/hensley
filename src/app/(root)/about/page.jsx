import { About } from "@/components/About";
import { fetchPageMetaData } from "@/services";
import { fetchAboutPageData } from "@/services/about";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("about");
    const { title, robotsTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && robotsTag) metadata.robots = robotsTag;
    return metadata;
  } catch (error) {
    logError("Error in metadata(about page):", error);
  }
}

export default async function Page() {  
  try {
    const data = await fetchAboutPageData();
    return (
      <About data={data}/>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}