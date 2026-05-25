import { CollectionPage } from "@/components/Collections";
import { fetchPageMetaData, buildPageMetadata } from "@/services";
import { fetchCollectionPagePaths, fetchSelectedCollectionData } from "@/services/collections";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

// Pre-render every featured collection slug at build time and serve them as
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
      fetchPageMetaData("collections"),
     fetchSelectedCollectionData(slug)
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
    const paths = await fetchCollectionPagePaths();
    return paths;
  } catch (error) {
    logError("Error generating static params(collection page):", error);
    return [];
  }
}

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    if (!slug) {
      throw new Error("Slug is required");
    }
    const data = await fetchSelectedCollectionData(slug);

    if (!data) {
      notFound();
    }

    return (
      <CollectionPage data={data} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
};