import { Product } from "@/components/Product";
import { FeaturedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import { fetchPageMetaData } from "@/services";
import { fetchProductData, fetchProductPageData, fetchProductPaths } from "@/services/products";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);

    const [
      metaData,
      productData
    ] = await Promise.all([
      fetchPageMetaData("product"),
      fetchProductData(slug)
    ]);

    const { title, noFollowTag } = metaData;
    const fullTitle = productData.product.name + " " + title;
    const metadata = { title: fullTitle };
    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) {
      metadata.robots = "noindex,nofollow";
    }

    return metadata;
  } catch (error) {
    logError("Error in metadata(product page):", error);
  }
}


export const generateStaticParams = async () => {
  try {
    const paths = await fetchProductPaths();
    return paths;
  } catch (error) {
    logError("Error generating static params(tent page):", error);
    return [];
  }
}

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const data = await fetchProductPageData(slug);
    const { matchedProducts, featuredProjectsData, pageDetails } = data;
    const { matchItWithTitle, featuredProductTitle } = pageDetails;

    if (!data) {
      throw new Error("Product data not found");
    }

    return (
      <>
        <Product data={data} />
        <MatchProducts classes={"bg-transparent z-10"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: matchItWithTitle }} buttonHide={true} loop={false} origin="start" />
        <FeaturedProjects classes={'z-10'} data={featuredProjectsData} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="start" />
      </>
    );
  } catch (error) {
    logError("Error fetching product page data:", error);
    notFound();
  }
}
