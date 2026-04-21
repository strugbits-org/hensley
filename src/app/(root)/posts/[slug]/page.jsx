import BlogDetails from "@/components/BlogDetails";
import { fetchBlogs, fetchPostPageData, fetchSelectedBlog } from "@/services/blogs";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }) => {
  try {
    const slug = decodeURIComponent(params.slug);
    const blog = await fetchSelectedBlog(slug);
    if (!blog) return {};
    return {
      title: blog.blogRef?.title || "",
      description: blog.blogRef?.excerpt || "",
      openGraph: {
        title: blog.blogRef?.title || "",
        description: blog.blogRef?.excerpt || "",
        images: blog.blogRef?.coverImage ? [{ url: blog.blogRef.coverImage }] : [],
      },
    };
  } catch (error) {
    logError("Error generating metadata (blog post page):", error);
    return {};
  }
};

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
