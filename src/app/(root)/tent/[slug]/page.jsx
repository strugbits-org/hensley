import ProductTent from "@/components/Product-Tent";
import { FeaturedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import { fetchTentsData } from "@/services";
import { fetchTentPageData } from "@/services/tents";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

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
    const { productData, matchedProducts, featuredProjectsData, pageDetails } = data;

    if (!data) {
      throw new Error("Product data not found");
    }

    console.log("Tent data is: ", pageDetails);

    const { matchItWithTitle, featuredProductTitle } = pageDetails

    return (
      <>
        <ProductTent productData={productData} />
        <MatchProducts classes={"bg-transparent"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: matchItWithTitle }} buttonHide={true} loop={false} origin="start" />
        <FeaturedProjects data={featuredProjectsData} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="start" />
      </>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
