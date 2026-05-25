
import QuotesHistory from "@/components/Account/QuotesHistory/QuotesHistory";
import { fetchQuoteHistoryPageDetails } from "@/services/quotes/QuoteApis";
import { fetchPageMetaData, buildPageMetadata } from "@/services";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
    try {
        const metaData = await fetchPageMetaData("quotes-history");
        return buildPageMetadata(metaData);
    } catch (error) {
        logError("Error in metadata(quotes-history page):", error);
    }
}

export default async function Page() {
    try {
        const data = await fetchQuoteHistoryPageDetails();
        const { quoteHistoryTitle } = data;

        return (
            <QuotesHistory pageTitle={quoteHistoryTitle} data={data} />
        );
    } catch (error) {
        logError("Error fetching Quotes History:", error);
        notFound();
    }
}
