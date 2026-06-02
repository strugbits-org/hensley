import BlogDetails from "@/components/BlogDetails";
import { fetchPostPageData } from "@/services/blogs";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

// Dynamic preview twin of /posts/[slug]. The public page stays static; the
// middleware rewrites `/posts/<slug>?preview=<token>` here so only previewers
// pay for dynamic rendering. Reuses the same component + draft-aware service.
export const dynamic = "force-dynamic";

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
    logError("Error fetching blog preview data:", error);
    notFound();
  }
}
