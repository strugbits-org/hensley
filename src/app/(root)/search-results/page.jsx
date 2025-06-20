import SearchResult from "@/components/SearchResult";
import { fetchSearchPageDetails } from "@/services/search";
import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {
  try {
    
    const response = await fetchSearchPageDetails();
    const {searchPageDetails} = response;

    return (
      <>
        <div className='h-[130px]'></div>
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
