import { Product } from "@/components/Product";
import { FeaturedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import { fetchProductPageData } from "@/services/products";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

// Dynamic preview twin of /product/[slug]. The public page stays static; the
// middleware rewrites `/product/<slug>?preview=<token>` here so only previewers
// pay for dynamic rendering. Reuses the same component + draft-aware service so
// scheduled-version (content variant) drafts can be reviewed before publish.
export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "products");
    const data = await fetchProductPageData(slug, { draft: isPreview });

    if (data === null) {
      notFound();
    }

    const { matchedProducts, featuredProjectsData, pageDetails, allCollections = [] } = data;
    const { matchItWithTitle, featuredProductTitle } = pageDetails;

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <Product data={data} matchedProducts={matchedProducts || []} allCollections={allCollections} />
        <MatchProducts classes={"bg-transparent z-10"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: matchItWithTitle }} buttonHide={true} loop={false} origin="auto" allCollections={allCollections} />
        <FeaturedProjects classes={'z-10'} data={featuredProjectsData} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="auto" />
      </>
    );
  } catch (error) {
    logError("Error fetching product preview data:", error);
    notFound();
  }
}
