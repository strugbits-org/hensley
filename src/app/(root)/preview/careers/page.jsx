import Careers from "@/components/Careers";
import { fetchCareersPageData } from "@/services/careers";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

// Dynamic preview twin of /careers. Public page stays static; middleware
// rewrites /careers?preview=<token> here. Renders with draft sections.
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  try {
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "sections");
    const data = await fetchCareersPageData({ draft: isPreview });

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <Careers data={data} />
      </>
    );
  } catch (error) {
    logError("Error fetching careers preview data:", error);
    notFound();
  }
}
