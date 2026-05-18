import { Product } from "@/components/Product";
import { FeaturedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import OurCategories from "@/components/common/OurCategories";
import { fetchPageMetaData } from "@/services";
import { fetchProductData, fetchProductPageData, fetchProductPaths } from "@/services/products";
import { queryProductsBySlug } from "@/services/payloadCollections";
import { logError, normalizeProductForDisplay, richTextToPlainText } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);

    const [
      metaData,
      product
    ] = await Promise.all([
      fetchPageMetaData("product"),
      queryProductsBySlug(slug)
    ]);

    const { title, robotsTag } = metaData;
    const normalizedProduct = normalizeProductForDisplay(product || {});
    const fullTitle = `${normalizedProduct.name} ${title}`;
    const metadata = {
      title: fullTitle,
      description: richTextToPlainText(product?.description).slice(0, 160) || undefined,
    };
    if (process.env.ENVIRONMENT === "PRODUCTION" && robotsTag) {
      metadata.robots = robotsTag;
    }

    return metadata;
  } catch (error) {
    logError("Error in metadata(product page):", error);
  }
}

export const generateStaticParams = async () => {
  try {
    const paths = await fetchProductPaths();
    return paths.slice(0, 100); // Limit to first 100 paths
  } catch (error) {
    logError("Error generating static params(product page):", error);
    return [];
  }
}

export default async function Page({ params }) {
  const slug = decodeURIComponent(params.slug);
  const data = await fetchProductPageData(slug);

  // Only call notFound() when the product genuinely does not exist.
  // Transient upstream errors re-throw from fetchProductPageData and surface as
  // an error page (which is retried on reload) — never a cached 404.
  if (data === null) {
    notFound();
  }

  const { matchedProducts, featuredProjectsData, pageDetails, allCollections = [] } = data;
  const { matchItWithTitle, featuredProductTitle } = pageDetails;

  return (
    <>
      <Product data={data} matchedProducts={matchedProducts || []} allCollections={allCollections} />
      <MatchProducts classes={"bg-transparent z-10"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: matchItWithTitle }} buttonHide={true} loop={false} origin="auto" allCollections={allCollections} />
      <FeaturedProjects classes={'z-10'} data={featuredProjectsData} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="auto" />
    </>
  );
}
