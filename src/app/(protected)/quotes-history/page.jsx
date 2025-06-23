
import QuotesHistory from "@/components/Account/QuotesHistory/QuotesHistory";
import { fetchQuoteHistoryPageDetails } from "@/services/quotes/QuoteApis";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {

        const data = await fetchQuoteHistoryPageDetails();

        const { quoteHistoryTitle } = data;

        console.log("page detials history: ", data);

        return (
            <QuotesHistory pageTitle={quoteHistoryTitle} data={data} />
        );
    } catch (error) {
        logError("Error fetching Quotes History:", error);
        notFound();
    }
}
