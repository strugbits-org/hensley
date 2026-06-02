import { About } from "@/components/About";
import { fetchAboutPageData } from "@/services/about";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

// Dynamic preview twin of /about. The public page stays static; the middleware
// rewrites `/about?preview=<token>` here so only previewers pay for SSR. The
// page body is section-driven, so preview = draft sections in real context.
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  try {
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "sections");
    const data = await fetchAboutPageData({ draft: isPreview });

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <About data={data} />
      </>
    );
  } catch (error) {
    logError("Error fetching about preview data:", error);
    notFound();
  }
}
