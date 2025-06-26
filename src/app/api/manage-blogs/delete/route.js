import handleAuthentication from "@/services/auth/handleAuthentication";
import { createWixClient, logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    // Early authentication check
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { mainProduct, productSetItems } = await req.json();
    const { memberId } = authenticatedUserData;
    const wixClient = await createWixClient();

    // Admin authorization check
    const [badgesResponse] = await Promise.all([
      wixClient.badges.listBadgesPerMember([memberId])
    ]);

    const badgeIds = badgesResponse?.memberBadgeIds[0]?.badgeIds || [];
    const adminBadgeId = process.env.ADMIN_BADGE_ID;

    if (!badgeIds.includes(adminBadgeId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const productId = mainProduct.product._id;
    const productIds = [productId, ...productSetItems.map(item => item._id)];
    await wixClient.items.remove("MultipleProductsSet", mainProduct._id);
    const products = await wixClient.items.query("FullProductData").hasSome("product", productIds).find()

    // Optimized product payload mapping
    const productsPayload = products.items.map(item => ({
      ...item,
      ...(productId === item.product
        ? { isProductCollection: false }
        : { productSetItem: false }
      )
    }));

    // Final bulk update
    await wixClient.items.bulkUpdate("FullProductData", productsPayload);

    products.items.forEach(item => {
      if (typeof item.product === "string") return;
      revalidatePath(`/product/${item.product.slug}`);
    });

    return NextResponse.json({
      message: "Product Set Deleted Successfully",
    }, { status: 200 });

  } catch (error) {
    logError("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};