
import QuotesHistory from "@/components/Account/QuotesHistory/QuotesHistory";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
    try {

        return (
            <QuotesHistory />
        );
    } catch (error) {
        logError("Error fetching Quotes History:", error);
        notFound();
    }
}
