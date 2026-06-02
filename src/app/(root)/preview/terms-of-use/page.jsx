import TermsOfUse from "@/components/TermsOfUse";
import { fetchTermsConditionsPageData } from "@/services/termsofuse";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

// Dynamic preview twin of /terms-of-use. Public page stays static; middleware
// rewrites /terms-of-use?preview=<token> here. Renders with draft sections.
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  try {
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "sections");
    const { termsData } = await fetchTermsConditionsPageData({ draft: isPreview });

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <TermsOfUse data={termsData} />
      </>
    );
  } catch (error) {
    logError("Error fetching terms of use preview data:", error);
    notFound();
  }
}
