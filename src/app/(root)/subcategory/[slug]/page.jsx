import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { SubCategoryPage } from "@/components/SubCategory";
import { fetchSelectedCategoryData, fetchSubCategoryPagePaths } from "@/services/subcategory";
import { fetchPageMetaData, buildPageMetadata } from "@/services";

// Pre-render every known subcategory slug at build time and serve them as
// static HTML. Unknown slugs fall through to on-demand rendering (then cached).
export const dynamicParams = true;
export const revalidate = +process.env.REVALIDATE_TIME || 86400;


export async function generateMetadata({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);

    const [
      metaData,
      subCategoryData
    ] = await Promise.all([
      fetchPageMetaData("subcategory"),
      fetchSelectedCategoryData(slug)
    ]);

    const { title } = metaData || {};
    const { selectedCategory } = subCategoryData || {};
    const fullTitle = (selectedCategory?.name || slug) + " " + (title || "");
    return buildPageMetadata(metaData, { title: fullTitle });
  } catch (error) {
    logError("Error in metadata(market page):", error);
  }
}

export const generateStaticParams = async () => {
  try {
    const paths = await fetchSubCategoryPagePaths();
    return paths;
  } catch (error) {
    logError("Error generating static params(subcategory page):", error);
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

    if (!data) {
      notFound();
      return;
    }

    const { pageDetails } = data;

    return (
      <SubCategoryPage data={data} pageDetails={pageDetails} />
    );
  } catch (error) {
    logError("Error fetching sub category page data:", error);
    notFound();
  }
}
