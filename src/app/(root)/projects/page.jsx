import Portfolio from "@/components/Portfolio";
import { fetchPortfolioPageData } from "@/services/projects";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    const data = await fetchPortfolioPageData();

    return (
      <Portfolio data={data} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
