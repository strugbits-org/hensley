import { QuoteDetails } from "@/components/QuoteDetails";
import { fetchQuote } from "@/services/quotes/QuoteApis";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const id = decodeURIComponent(params.id);
    const data = await fetchQuote(id);

    return (
      <QuoteDetails data={data} />
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
