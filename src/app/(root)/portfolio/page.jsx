import Portfolio from "@/components/Portfolio";
import { fetchPortfolioPageData } from "@/services/projects";
import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Portfolio | Hensley Creative Events",
  description: "Browse our portfolio of events, installations, and creative productions by Hensley Creative Events.",
};

export default async function Page() {
  try {
    const data = await fetchPortfolioPageData();

    return (
      <Suspense>
        <Portfolio data={data} />
      </Suspense>
    );
  } catch (error) {
    logError("Error fetching portfolio page data:", error);
    notFound();
  }
}
