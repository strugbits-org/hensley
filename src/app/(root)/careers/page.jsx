import Careers from "@/components/Careers";
import { fetchPageMetaData, buildPageMetadata } from "@/services";
import { fetchCareersPageData } from "@/services/careers";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("careers");
    return buildPageMetadata(metaData);
  } catch (error) {
    logError("Error in metadata(home page):", error);
  }
}

export default async function Page() {
  const data = await fetchCareersPageData();

  try {
    return (
        <Careers data={data}/>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
