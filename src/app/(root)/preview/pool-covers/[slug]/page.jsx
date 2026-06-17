import ProductPoolCover from "@/components/PoolCover";
import { FeaturedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import { fetchPoolCoverPageData } from "@/services/poolcover";
import { queryProductCollections } from "@/services/payloadCollections";
import { getPreviewState } from "@/services/preview";
import PreviewChrome from "@/components/common/PreviewChrome";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

// Dynamic preview twin of /pool-covers/[slug]. Middleware rewrites
// `/pool-covers/<slug>?preview=<token>` here so scheduled-version (content
// variant) drafts can be reviewed before publish.
export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "products");
    const [data, allCollections] = await Promise.all([
      fetchPoolCoverPageData(slug, { draft: isPreview }),
      queryProductCollections().catch(() => []),
    ]);

    if (!data) {
      notFound();
    }

    const { productData, matchedProducts, featuredProjectsData } = data;

    return (
      <>
        <PreviewChrome isPreview={isPreview} invalid={invalid} />
        <ProductPoolCover productData={productData} matchedProducts={matchedProducts || []} allCollections={allCollections} />
        <MatchProducts classes={"bg-transparent"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: "match it with" }} buttonHide={true} loop={false} origin="auto" allCollections={allCollections} />
        <FeaturedProjects data={featuredProjectsData} pageDetails={{ featuredProjectTitle: "Products featured in this PROJECT entry:" }} loop={false} origin="auto" />
      </>
    );
  } catch (error) {
    logError("Error fetching pool cover preview data:", error);
    notFound();
  }
}
