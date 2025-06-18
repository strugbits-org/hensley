import { MarketPage } from "@/components/Market";
import { fetchMarketsData } from "@/services";
import { fetchSelectedMarketData } from "@/services/market";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export const generateStaticParams = async () => {
  try {
    const marketsData = await fetchMarketsData();
    const paths = marketsData.map((data) => ({ slug: data.slug.trim().replace("/", "") }));
    return paths;
  } catch (error) {
    logError("Error generating static params(market page):", error);
    return [];
  }
}

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
