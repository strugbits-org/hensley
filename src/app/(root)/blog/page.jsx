import Blogs from "@/components/Blogs";
import { fetchBlogPageData } from "@/services/blogs";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    const data = await fetchBlogPageData();
    return (
      <Blogs data={data} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
