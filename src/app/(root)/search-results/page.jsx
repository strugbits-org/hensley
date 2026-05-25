import SearchResult from "@/components/SearchResult";
import { fetchPageMetaData, buildPageMetadata } from "@/services";
import { fetchSearchPageDetails } from "@/services/search";
import { queryProductCollections } from "@/services/payloadCollections";
import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("search-results");
    return buildPageMetadata(metaData);
  } catch (error) {
    logError("Error in metadata(home page):", error);
  }
}


export default async function Page() {
  try {
    const [searchPageDetails, allCollections] = await Promise.all([
      fetchSearchPageDetails(),
      queryProductCollections().catch(() => []),
    ]);

    return (
      <>
        <div className='h-[130px] hidden lg:block'></div>
        <Suspense>
          <SearchResult pageDetails={searchPageDetails} allCollections={allCollections} />
        </Suspense>
      </>
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
