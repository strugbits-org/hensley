import { Categories } from "@/components/Category";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({params}) {
  try {

     const slug = decodeURIComponent(params.slug);
     console.log("The Slug is: ",slug);

    return (
        <Categories slug={slug} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
