import { QuoteRequest } from "@/components/quote-request";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {

    return (
      <QuoteRequest />
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
