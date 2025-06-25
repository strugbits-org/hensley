import ProductTent from "@/components/Product-Tent";
import { FeaturedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import { fetchPageMetaData, fetchTentsData } from "@/services";
import { fetchTentData, fetchTentPageData } from "@/services/tents";
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

    const { title, noFollowTag } = metaData;

    const fullTitle = tentData.title + title;

    const metadata = { title: fullTitle };

    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) {
      metadata.robots = "noindex,nofollow";
    }

    return metadata;
  } catch (error) {
    logError("Error in metadata(tent page):", error);
  }
}

export const generateStaticParams = async () => {
  try {
    const tentsData = await fetchTentsData();
    const paths = tentsData.map((data) => ({ slug: data.slug.trim().replace("/", "") }));
    return paths;
  } catch (error) {
    logError("Error generating static params(tent page):", error);
    return [];
  }
}

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const data = await fetchTentPageData(slug);
    const { productData, matchedProducts, featuredProjectsData, pageDetails, masterClassTentingURL } = data;

    if (!data) {
      throw new Error("Product data not found");
    }

    const { matchItWithTitle, featuredProductTitle } = pageDetails;

    return (
      <>
        <ProductTent productData={productData} masterClassTentingURL={masterClassTentingURL} />
        <MatchProducts classes={"bg-transparent"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: matchItWithTitle }} buttonHide={true} loop={false} origin="auto" />
        <FeaturedProjects data={featuredProjectsData} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="auto" />
      </>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
