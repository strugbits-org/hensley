import { Product } from "@/components/Product";
import { FeatuedProjects } from "@/components/Product/FeaturedProjects";
import { MatchProducts } from "@/components/Product/MatchProducts";
import { fetchProductPageData } from "@/services/products";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const data = await fetchProductPageData(slug);
    const { matchedProducts, featuredProjectsData } = data;

    if (!data) {
      throw new Error("Product data not found");
    }

    return (
      <>
        <Product data={data} />
        <MatchProducts classes={"bg-transparent z-10"} headingClasses={"!text-secondary-alt"} data={matchedProducts} pageDetails={{ matchProductsTitle: "match it with" }} buttonHide={true} loop={false} origin="start" />
        <FeatuedProjects classes={'z-10'} data={featuredProjectsData} pageDetails={{ featuredProjectTitle: "Products featured in this PROJECT entry:" }} loop={false} origin="start" />
      </>
    );
  } catch (error) {
    logError("Error fetching product page data:", error);
    notFound();
  }
}
