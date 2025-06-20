import { CollectionPage } from "@/components/Collections";
import { fetchPageMetaData } from "@/services";
import { fetchCollectionPagePaths, fetchSelectedCollectionData } from "@/services/collections";
import { logError } from "@/utils";
import { notFound } from "next/navigation";



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

    const { title, noFollowTag } = metaData;
    console.log("full data came as: ",subCategoryData);
    const {selectedCategory} = subCategoryData
    const fullTitle = selectedCategory?.name + " " + title;
    const metadata = { title: fullTitle };
    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) {
      metadata.robots = "noindex,nofollow";
    }

    return metadata;
  } catch (error) {
    logError("Error in metadata(market page):", error);
  }
}




export const generateStaticParams = async () => {
  try {
    const collectionsPaths = await fetchCollectionPagePaths();
    return collectionsPaths;
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
    const data = await fetchSelectedCollectionData(slug);

    return (
      <CollectionPage data={data} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
};