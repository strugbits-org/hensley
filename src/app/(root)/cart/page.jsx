import Cart from "@/components/Cart";
import { fetchPageMetaData } from "@/services";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("cart");
    const { title, robotsTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && robotsTag) metadata.robots = robotsTag;
    return metadata;
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
