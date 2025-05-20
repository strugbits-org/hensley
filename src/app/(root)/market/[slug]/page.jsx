import { MarketPage } from "@/components/Market";
import { fetchSelectedMarketData } from "@/services/market";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const data = await fetchSelectedMarketData(slug);

    return (
      <MarketPage slug={slug} data={data} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
