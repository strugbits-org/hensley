import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { SubCategoryPage } from "@/components/SubCategory";
import { fetchSelectedCategoryData, fetchSubCategoryPagePaths } from "@/services/subcategory";
import { fetchPageMetaData } from "@/services";


export async function generateMetadata({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);

    const [
      metaData,
      subCategoryData
    ] = await Promise.all([
      fetchPageMetaData("market"),
     fetchSelectedCategoryData(slug)
    ]);

    const { title, noFollowTag } = metaData;
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

    const { pageDetails } = data

    return (
      <SubCategoryPage data={data} pageDetails={pageDetails} />
    );
  } catch (error) {
    logError("Error fetching sub category page data:", error);
    notFound();
  }
}
