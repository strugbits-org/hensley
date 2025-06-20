import { QuoteRequest } from "@/components/QuoteRequest";
import { fetchQuotePageDetails } from "@/services/quotes/QuoteApis";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {

    const response = await fetchQuotePageDetails();
    return (
      <QuoteRequest data={response}/>
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
