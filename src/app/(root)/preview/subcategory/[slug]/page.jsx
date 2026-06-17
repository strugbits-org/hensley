import { SubCategoryPage } from "@/components/SubCategory";
import { fetchSelectedCategoryData } from "@/services/subcategory";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

// Dynamic preview twin of /subcategory/[slug]. Middleware rewrites
// `/subcategory/<slug>?preview=<token>` here so a scheduled-version (content
// variant) draft of the subcategory's presentation can be reviewed before
// publish.
export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "product-collections");
    const data = slug ? await fetchSelectedCategoryData(slug, { draft: isPreview }) : null;

    if (!data) {
      notFound();
    }

    const { pageDetails } = data;

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <SubCategoryPage data={data} pageDetails={pageDetails} />
      </>
    );
  } catch (error) {
    logError("Error fetching subcategory preview data:", error);
    notFound();
  }
}
