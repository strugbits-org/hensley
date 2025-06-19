import { CollectionPage } from "@/components/Collections";
import { fetchCollectionPagePaths, fetchSelectedCollectionData } from "@/services/collections";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

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