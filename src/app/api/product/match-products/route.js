import handleAuthentication from "@/services/auth/handleAuthentication";
import { invalidatePath } from "@/services/invalidation";
import { createWixClient, logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {

    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { mainProduct, matchedProducts } = await req.json();
    const { memberId } = authenticatedUserData;


    const wixClient = await createWixClient();
    const badgesResponse = await wixClient.badges.listBadgesPerMember([memberId]);
    const badgeIds = badgesResponse?.memberBadgeIds?.[0]?.badgeIds || [];

    if (!badgeIds.includes(process.env.ADMIN_BADGE_ID)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mainProductId = mainProduct._id;

    const fullData = await wixClient.items.query("MATCHITWITH").eq("product", mainProductId).find();
    let itemId = fullData?.items?.[0]?._id;

    if (!itemId) {
      const response = await wixClient.items.insert("MATCHITWITH", { product: mainProductId });
      itemId = response?._id;
    }

    const productIds = matchedProducts?.map(item => item._id) || [];
    await wixClient.items.replaceReferences("MATCHITWITH", "matchProducts", itemId, productIds);
    invalidatePath(`/product/${mainProduct.slug}`);

    return NextResponse.json({
      message: "Product updated successfully updated",
      matchedProducts
    }, { status: 200 });

  } catch (error) {
    logError("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};