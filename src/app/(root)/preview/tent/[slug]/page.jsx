import ProductTent from "@/components/Product-Tent";
import { FeaturedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import { fetchTentPageData } from "@/services/tents";
import { queryProductCollections } from "@/services/payloadCollections";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

// Dynamic preview twin of /tent/[slug]. Middleware rewrites
// `/tent/<slug>?preview=<token>` here so scheduled-version (content variant)
// drafts can be reviewed before publish. Reuses the same component + a
// draft-aware service path.
export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "products");
    const [data, allCollections] = await Promise.all([
      fetchTentPageData(slug, { draft: isPreview }),
      queryProductCollections().catch(() => []),
    ]);

    if (!data) {
      notFound();
    }

    const { productData, matchedProducts, featuredProjectsData, pageDetails, masterClassTentingURL } = data;
    const { matchItWithTitle, featuredProductTitle } = pageDetails || {};

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <ProductTent productData={productData} masterClassTentingURL={masterClassTentingURL} matchedProducts={matchedProducts || []} allCollections={allCollections} />
        <MatchProducts classes={"bg-transparent"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: matchItWithTitle }} buttonHide={true} loop={false} origin="auto" allCollections={allCollections} />
        <FeaturedProjects data={featuredProjectsData} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="auto" />
      </>
    );
  } catch (error) {
    logError("Error fetching tent preview data:", error);
    notFound();
  }
}
