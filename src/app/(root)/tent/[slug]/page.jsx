import ProductTent from "@/components/Product-Tent";
import { FeatuedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import { fetchTentPageData } from "@/services/tents";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const data = await fetchTentPageData(slug);
    const { productData, matchedProducts, featuredProjectsData } = data;

    if (!data) {
      throw new Error("Product data not found");
    }

    return (
      <>
        <ProductTent productData={productData} />
        <MatchProducts classes={"bg-transparent"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: "match it with" }} buttonHide={true} loop={false} origin="start" />
        <FeatuedProjects data={featuredProjectsData} pageDetails={{ featuredProjectTitle: "Products featured in this PROJECT entry:" }} loop={false} origin="start" />
      </>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
