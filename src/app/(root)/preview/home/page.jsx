import { HomePage } from "@/components/Home";
import { fetchHomePageData } from "@/services/home";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

// Dynamic preview twin of / (home). Public home stays static; middleware
// rewrites /?preview=<token> here. Renders the home page with draft sections.
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  try {
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "sections");
    const data = await fetchHomePageData({ draft: isPreview });

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <HomePage data={data} />
      </>
    );
  } catch (error) {
    logError("Error fetching home preview data:", error);
    notFound();
  }
}
