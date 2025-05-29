import { Product } from "@/components/Product";
import { fetchProductPageData } from "@/services/products";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const data = await fetchProductPageData(slug);

    if (!data) {
      throw new Error("Product data not found");
    }

    return (
      <>
        <Product data={data} />
      </>
    );
  } catch (error) {
    logError("Error fetching product page data:", error);
    notFound();
  }
}
