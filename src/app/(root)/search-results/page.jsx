import SearchResult from "@/components/SearchResult";
import { fetchPageMetaData } from "@/services";
import { fetchSearchPageDetails } from "@/services/search";
import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("search-results");
    const { title, noFollowTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) metadata.robots = "noindex,nofollow";
    return metadata;
  } catch (error) {
    logError("Error in metadata(home page):", error);
  }
}


export default async function Page() {
  try {
    
    const response = await fetchSearchPageDetails();
    const {searchPageDetails} = response;

    return (
      <>
        <div className='h-[130px] hidden lg:block'></div>
        <Suspense>
          <SearchResult pageDetails={searchPageDetails}/>
        </Suspense>
      </>
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
