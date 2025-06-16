import SearchResult from "@/components/SearchResult";
import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {
  try {
    return (
      <Suspense>
        <SearchResult />
      </Suspense>
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
