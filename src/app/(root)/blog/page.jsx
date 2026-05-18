import Blogs from "@/components/Blogs";
import { fetchPageMetaData } from "@/services";
import { fetchBlogPageData } from "@/services/blogs";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("blog");
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
    const data = await fetchBlogPageData();

    return (
      <Blogs data={data} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
