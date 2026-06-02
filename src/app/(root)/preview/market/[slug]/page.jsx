import { MarketPage } from "@/components/Market";
import { fetchSelectedMarketData } from "@/services/market";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

// Dynamic preview twin of /market/[slug]. The public page stays static; the
// middleware rewrites `/market/<slug>?preview=<token>` here so only previewers
// pay for dynamic rendering. Reuses the same component + draft-aware service.
export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "markets");
    const data = await fetchSelectedMarketData(slug, { draft: isPreview });

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <MarketPage slug={slug} data={data} />
      </>
    );
  } catch (error) {
    logError("Error fetching market preview data:", error);
    notFound();
  }
}
