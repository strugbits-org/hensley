import { CollectionPage } from "@/components/Collections";
import { fetchSelectedCollectionData } from "@/services/collections";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

// Dynamic preview twin of /collections/[slug]. Middleware rewrites
// `/collections/<slug>?preview=<token>` here so a scheduled-version (content
// variant) draft of the collection's presentation can be reviewed before
// publish. Products in the listing remain published.
export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "product-collections");
    const data = slug ? await fetchSelectedCollectionData(slug, { draft: isPreview }) : null;

    if (!data) {
      notFound();
    }

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <CollectionPage data={data} />
      </>
    );
  } catch (error) {
    logError("Error fetching collection preview data:", error);
    notFound();
  }
}
