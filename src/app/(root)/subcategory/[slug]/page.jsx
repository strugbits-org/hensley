import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { SubCategories } from "@/components/SubCategories";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);

    return (
     <SubCategories />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
