import Blogs from "@/components/Blogs";
import { fetchBlogPageData } from "@/services/blogs";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

// Dynamic preview twin of /blog. Public page stays static; middleware rewrites
// /blog?preview=<token> here. Renders the listing with draft page-title section.
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  try {
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "sections");
    const data = await fetchBlogPageData({ draft: isPreview });

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <Blogs data={data} />
      </>
    );
  } catch (error) {
    logError("Error fetching blog preview data:", error);
    notFound();
  }
}
