import BlogDetails from "@/components/BlogDetails";
import { fetchPostPageData } from "@/services/blogs";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const data = await fetchPostPageData(slug);

    return (
      <BlogDetails data={data} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
