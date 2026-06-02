import BlogDetails from "@/components/BlogDetails";
import { fetchBlogs, fetchBlogMetadataBySlug, fetchPostPageData } from "@/services/blogs";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }) => {
  try {
    const slug = decodeURIComponent(params.slug);
    // Slim metadata-only fetch — see fetchBlogMetadataBySlug docstring.
    // Avoids the depth:2 double-fetch that Next 14 imposes when generateMetadata
    // and the page body share a slug.
    const blog = await fetchBlogMetadataBySlug(slug);
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

export default async function Page({ params, searchParams }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "blogs");
    const data = await fetchPostPageData(slug, { draft: isPreview });

    if (!data?.blog) return notFound();

    const { blog, otherBlogs, pageDetails } = data;

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <BlogDetails data={{ blog, otherBlogs, ...pageDetails }} />
      </>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
