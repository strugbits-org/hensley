import PrivacyPolicy from "@/components/PrivacyPolicy";
import { fetchPrivacyPolicyPageData } from "@/services/privacyPolicy";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

// Dynamic preview twin of /privacy-policy. Public page stays static; middleware
// rewrites /privacy-policy?preview=<token> here. Renders with draft sections.
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  try {
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "sections");
    const { privacyData } = await fetchPrivacyPolicyPageData({ draft: isPreview });

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <PrivacyPolicy data={privacyData} />
      </>
    );
  } catch (error) {
    logError("Error fetching privacy policy preview data:", error);
    notFound();
  }
}
