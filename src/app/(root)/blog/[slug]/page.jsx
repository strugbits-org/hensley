import BlogDetails from "@/components/BlogDetails";
import { fetchSelectedMarketData } from "@/services/market";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const data = await fetchSelectedMarketData(slug);

    return (
        <BlogDetails />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
