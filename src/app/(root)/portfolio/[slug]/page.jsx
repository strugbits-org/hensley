import PortfolioDetails from "@/components/PortfolioDetails";
import { fetchSelectedCollectionData } from "@/services/collections";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    if (!slug) {
      throw new Error("Slug is required");
    }
    const data = await fetchSelectedCollectionData(slug);

    return (
        <PortfolioDetails />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
};