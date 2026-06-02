import Contact from "@/components/Contact";
import { fetchContactPageData } from "@/services/contact/contact";
import { logError } from "@/utils";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { notFound } from "next/navigation";

// Dynamic preview twin of /contact. Public page stays static; middleware
// rewrites /contact?preview=<token> here. Renders with draft sections.
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  try {
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "sections");
    const data = await fetchContactPageData({ draft: isPreview });

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <Contact data={data} />
      </>
    );
  } catch (error) {
    logError("Error fetching contact preview data:", error);
    notFound();
  }
}
