import PortfolioDetails from "@/components/PortfolioDetails";
import { fetchProjectPageData } from "@/services/projects";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

// Dynamic preview twin of /project/[slug]. The public page stays static; the
// middleware rewrites `/project/<slug>?preview=<token>` here so only previewers
// pay for dynamic rendering. Reuses the same component + draft-aware service.
export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  try {
    const slug = decodeURIComponent(params.slug);
    if (!slug) throw new Error("Slug is required");

    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "projects");
    const data = await fetchProjectPageData(slug, { draft: isPreview });

    if (!data?.project) notFound();

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <PortfolioDetails data={data} />
      </>
    );
  } catch (error) {
    logError("Error fetching project preview data:", error);
    notFound();
  }
}
