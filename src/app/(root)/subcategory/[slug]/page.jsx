import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { SubCategoryPage } from "@/components/SubCategory";
import { fetchSelectedCategoryData } from "@/services/subcategory";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    if (!slug) {
      throw new Error("Slug is required");
    }
    const data = await fetchSelectedCategoryData(slug);    

    const {pageDetails} = data

    console.log("sub data is the: ",pageDetails);

    return (
      <SubCategoryPage data={data} pageDetails={pageDetails}/>
    );
  } catch (error) {
    logError("Error fetching sub category page data:", error);
    notFound();
  }
}
