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
  const slug = decodeURIComponent(params.slug);

  // No subcategory matches this slug — render the 404 page. Transient fetch
  // failures surface as a retryable error page, never a cached 404.
  const data = slug ? await fetchSelectedCategoryData(slug) : null;
  if (!data) {
    notFound();
  }

  const { pageDetails } = data;

  return (
    <SubCategoryPage data={data} pageDetails={pageDetails} />
  );
}
