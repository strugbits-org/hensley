import { MarketPage } from "@/components/Market";
import { fetchMarketBySlug } from "@/services/market";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const marketData = await fetchMarketBySlug(slug);

    return (
      <MarketPage slug={slug} data={marketData} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
