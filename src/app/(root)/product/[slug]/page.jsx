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

    const { title, noFollowTag } = metaData;
    const normalizedProduct = normalizeProductForDisplay(product || {});
    const fullTitle = `${normalizedProduct.name} ${title}`;
    const metadata = {
      title: fullTitle,
      description: richTextToPlainText(product?.description).slice(0, 160) || undefined,
    };
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
    // const paths = [];
    return paths.slice(0, 2);
  } catch (error) {
    logError("Error generating static params(product page):", error);
    return [];
  }
}

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const data = await fetchProductPageData(slug);
    // const { matchedProducts, featuredProjectsData, pageDetails, ourCategoriesData, allCollections = [] } = data;
    const { matchedProducts, featuredProjectsData, pageDetails, allCollections = [] } = data;
    const { matchItWithTitle, featuredProductTitle } = pageDetails;

    if (!data) {
      throw new Error("Product data not found");
    }

    return (
      <>
        <Product data={data} matchedProducts={matchedProducts || []} allCollections={allCollections} />
        {/* <OurCategories
          data={ourCategoriesData || []}
          pageDetails={{ ourCategoriesTitle: pageDetails?.ourCategoriesTitle || "SHOP BY CATEGORY" }}
        /> */}
        <MatchProducts classes={"bg-transparent z-10"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: matchItWithTitle }} buttonHide={true} loop={false} origin="auto" allCollections={allCollections} />
        <FeaturedProjects classes={'z-10'} data={featuredProjectsData} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="auto" />
      </>
    );
  } catch (error) {
    logError("Error fetching product page data:", error);
    notFound();
  }
}
