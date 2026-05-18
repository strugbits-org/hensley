import ProductPoolCover from "@/components/PoolCover";
import { FeaturedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import { fetchPoolCoverPageData, fetchPoolCovers } from "@/services/poolcover";
import { queryProductCollections } from "@/services/payloadCollections";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export const generateStaticParams = async () => {
  try {
    const poolCovers = await fetchPoolCovers();
    const paths = poolCovers.map((data) => ({ slug: data.slug.trim().replace("/", "") }));
    return paths;
  } catch (error) {
    logError("Error generating static params(pool cover page):", error);
    return [];
  }
}

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const [data, allCollections] = await Promise.all([
      fetchPoolCoverPageData(slug),
      queryProductCollections().catch(() => []),
    ]);
    if (!data) {
      throw new Error("Product data not found");
    }

    const { productData, matchedProducts, featuredProjectsData } = data;

    return (
      <>
        <ProductPoolCover productData={productData} matchedProducts={matchedProducts || []} allCollections={allCollections} />
        <MatchProducts classes={"bg-transparent"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: "match it with" }} buttonHide={true} loop={false} origin="auto" allCollections={allCollections} />
        <FeaturedProjects data={featuredProjectsData} pageDetails={{ featuredProjectTitle: "Products featured in this PROJECT entry:" }} loop={false} origin="auto" />
      </>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
