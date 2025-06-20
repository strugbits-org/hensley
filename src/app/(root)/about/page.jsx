import { About } from "@/components/About";
import { fetchPageMetaData } from "@/services";
import { fetchAboutPageData } from "@/services/about";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("subcategory");
    const { title, noFollowTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) metadata.robots = "noindex,nofollow";
    return metadata;
  } catch (error) {
    logError("Error in metadata(sub category page):", error);
  }
}

export default async function Page() {  
  try {
    const data = await fetchAboutPageData();

    console.log("The data is the: ",data);
    
    return (
      <About data={data}/>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}

export const dynamic = "force-dynamic";