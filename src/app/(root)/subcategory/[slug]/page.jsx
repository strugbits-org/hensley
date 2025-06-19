import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { SubCategoryPage } from "@/components/SubCategory";
import { fetchSelectedCategoryData, fetchSubCategoryPagePaths } from "@/services/subcategory";

export const generateStaticParams = async () => {
  try {
    const paths = await fetchSubCategoryPagePaths();
  return paths;
  } catch (error) {
    logError("Error generating static params(tent page):", error);
    return [];
  }
}

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    if (!slug) {
      throw new Error("Slug is required");
    }
    const data = await fetchSelectedCategoryData(slug);    

    return (
      <SubCategoryPage data={data} />
    );
  } catch (error) {
    logError("Error fetching sub category page data:", error);
    notFound();
  }
}
