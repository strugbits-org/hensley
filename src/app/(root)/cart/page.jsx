import Cart from "@/components/Cart";
import { fetchPageMetaData, buildPageMetadata } from "@/services";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("cart");
    return buildPageMetadata(metaData);
  } catch (error) {
    logError("Error in metadata(home page):", error);
  }
}


export default async function Page() {
  try {
    return <Cart />;
  } catch (error) {
    logError("Error fetching cart page data:", error);
    notFound();
  }
}
