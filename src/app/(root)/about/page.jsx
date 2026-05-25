import { About } from "@/components/About";
import { fetchPageMetaData, buildPageMetadata } from "@/services";
import { fetchAboutPageData } from "@/services/about";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("about");
    return buildPageMetadata(metaData);
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