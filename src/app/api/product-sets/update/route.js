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

    const { mainProduct, productSetItems, removedItems } = await req.json();
    const { memberId } = authenticatedUserData;
    const wixClient = await createWixClient();

    // Admin authorization check
    const badgesResponse = await wixClient.badges.listBadgesPerMember([memberId]);
    const badgeIds = badgesResponse?.memberBadgeIds[0]?.badgeIds || [];

    if (!badgeIds.includes(process.env.ADMIN_BADGE_ID)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const productId = mainProduct.product._id;
    const productIds = [...productSetItems.map(item => item._id), ...removedItems];

    // Prepare payload data
    const payloadData = {
      _id: mainProduct._id,
      product: productId,
      productSetItems: productSetItems.map(item => ({
        product: item._id,
        quantity: item.quantity,
      }))
    };

    // Execute insert and query in parallel
    const [updatedItem, products] = await Promise.all([
      wixClient.items.update("MultipleProductsSet", payloadData),
      wixClient.items.query("FullProductData").hasSome("product", productIds).find()
    ]);

    // Execute reference replacement and bulk update in parallel
    const [,] = await Promise.all([
      wixClient.items.replaceReferences(
        "MultipleProductsSet",
        "products",
        updatedItem._id,
        productSetItems.map(x => x.product)
      ),
      wixClient.items.bulkUpdate(
        "FullProductData",
        products.items.map(item => ({
          ...item,
          productSetItem: removedItems.includes(item.product) ? false : true,
        }))
      )
    ]);

    const data = products.items.map(item => ({
      ...item,
      productSetItem: removedItems.includes(item.product) ? false : true,
    }));

    products.items.forEach(item => {
      if (typeof item.product === "string") return;
      revalidatePath(`/product/${item.product.slug}`);
    });
    revalidatePath(`/product/${mainProduct.product.slug}`);

    return NextResponse.json({
      message: "Product Set Updated Successfully",
      removedItems,
      productSetItems,
      data
    }, { status: 200 });

  } catch (error) {
    logError("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};