import PortfolioDetails from "@/components/PortfolioDetails";
import { fetchProjectPageData } from "@/services/projects";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    if (!slug) {
      throw new Error("Slug is required");
    }
    const data = await fetchProjectPageData(slug);

    return (
      <PortfolioDetails data={data} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
};