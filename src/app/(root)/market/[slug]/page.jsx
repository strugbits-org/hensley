import { MarketPage } from "@/components/Market";
import { fetchMarketsData, fetchPageMetaData, buildPageMetadata, fetchSelectedMarketsData } from "@/services";
import { fetchSelectedMarketData } from "@/services/market";
import { logError } from "@/utils";
import { notFound } from "next/navigation";


export async function generateMetadata({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);

    const [
      metaData,
      marketData
    ] = await Promise.all([
      fetchPageMetaData("market"),
      fetchSelectedMarketsData(slug)
    ]);

    const { title } = metaData || {};
    const fullTitle = (marketData?.title || slug) + " " + (title || "");
    return buildPageMetadata(metaData, { title: fullTitle });
  } catch (error) {
    logError("Error in metadata(market page):", error);
  }
}



export const generateStaticParams = async () => {
  try {
    const marketsData = await fetchMarketsData();
    return (marketsData || [])
      .map((data) => {
        const raw = typeof data?.slug === "string" ? data.slug.trim() : "";
        const slug = raw.replace(/^\//, "");
        return slug ? { slug } : null;
      })
      .filter(Boolean);
  } catch (error) {
    logError("Error generating static params(market page):", error);
    return [];
  }
}

export default async function Page({ params }) {
  const slug = decodeURIComponent(params.slug);
  const data = await fetchSelectedMarketData(slug);

  if (!data) {
    notFound();
  }

  return (
    <MarketPage slug={slug} data={data} />
  );
}
