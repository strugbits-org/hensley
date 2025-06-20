import Cart from "@/components/Cart";
import { fetchPageMetaData } from "@/services";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("cart");
    const { title, noFollowTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) metadata.robots = "noindex,nofollow";
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
