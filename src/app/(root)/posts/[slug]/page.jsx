import BlogDetails from "@/components/BlogDetails";
import { fetchBlogs, fetchPostPageData } from "@/services/blogs";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export const generateStaticParams = async () => {
  try {
    const blogData = await fetchBlogs();
    const paths = blogData.map((data) => ({ slug: data.slug.trim().replace("/", "") }));
    return paths;
  } catch (error) {
    logError("Error generating static params(blog page):", error);
    return [];
  }
}

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
