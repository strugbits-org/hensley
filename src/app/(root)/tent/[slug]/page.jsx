import ProductTent from "@/components/Product-Tent";
import { FeaturedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import { fetchPageMetaData, buildPageMetadata, fetchTentsData } from "@/services";
import { fetchTentData, fetchTentPageData } from "@/services/tents";
import { queryProductCollections } from "@/services/payloadCollections";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);

    const [
      metaData,
      tentData
    ] = await Promise.all([
      fetchPageMetaData("tent"),
      fetchTentData(slug)
    ]);

    const { title } = metaData || {};
    const fullTitle = (tentData?.title || slug) + (title || "");
    return buildPageMetadata(metaData, { title: fullTitle });
  } catch (error) {
    logError("Error in metadata(tent page):", error);
  }
}

export const generateStaticParams = async () => {
  try {
    const tentsData = await fetchTentsData();
    if (!Array.isArray(tentsData)) return [];
    const paths = tentsData.map((data) => {
      const rawSlug = data.slug || data.tent?.slug || "";
      return { slug: rawSlug.replace(/^\//, "").trim() };
    });
    return paths;
  } catch (error) {
    logError("Error generating static params(tent page):", error);
    return [];
  }
}

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const [data, allCollections] = await Promise.all([
      fetchTentPageData(slug),
      queryProductCollections().catch(() => []),
    ]);

    if (!data) {
      throw new Error("Product data not found");
    }

    const { productData, matchedProducts, featuredProjectsData, pageDetails, masterClassTentingURL } = data;
    const { matchItWithTitle, featuredProductTitle } = pageDetails || {};

    return (
      <>
        <ProductTent productData={productData} masterClassTentingURL={masterClassTentingURL} matchedProducts={matchedProducts || []} allCollections={allCollections} />
        <MatchProducts classes={"bg-transparent"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: matchItWithTitle }} buttonHide={true} loop={false} origin="auto" allCollections={allCollections} />
        <FeaturedProjects data={featuredProjectsData} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="auto" />
      </>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
