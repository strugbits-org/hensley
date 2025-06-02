import { QuoteRequest } from "@/components/QuoteRequest";
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
