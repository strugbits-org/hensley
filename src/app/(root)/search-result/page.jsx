import SearchResult from "@/components/SearchResult";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {

    return (
        <SearchResult />
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
