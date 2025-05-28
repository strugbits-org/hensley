import QuoteDetails from "@/components/QuoteDetails";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {

    return (
      <QuoteDetails />
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
