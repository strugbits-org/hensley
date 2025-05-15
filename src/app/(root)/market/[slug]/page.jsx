import { MarketPage } from "@/components/Market";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({params}) {
  try {
     const slug = decodeURIComponent(params.slug);

    return (
        <MarketPage slug={slug} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
