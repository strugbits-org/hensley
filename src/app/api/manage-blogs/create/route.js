import handleAuthentication from "@/services/auth/handleAuthentication";
import { createWixClient, logError } from "@/utils";
import { revalidatePath } from "next/cache";
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
    const badgesResponse = await wixClient.badges.listBadgesPerMember([memberId]);
    const badgeIds = badgesResponse?.memberBadgeIds[0]?.badgeIds || [];

    if (!badgeIds.includes(process.env.ADMIN_BADGE_ID)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const productId = mainProduct._id;
    const productIds = [productId, ...productSetItems.map(item => item._id)];

    // Prepare payload data
    const payloadData = {
      product: productId,
      productSetItems: productSetItems.map(item => ({
        product: item._id,
        quantity: item.quantity,
      }))
    };

    // Execute insert and query in parallel
    const [updatedItem, products] = await Promise.all([
      wixClient.items.insert("MultipleProductsSet", payloadData),
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
          ...(productId === item.product
            ? { isProductCollection: true }
            : { productSetItem: true }
          )
        }))
      )
    ]);

    products.items.forEach(item => {
      if (typeof item.product === "string") return;
      revalidatePath(`/product/${item.product.slug}`);
    });

    return NextResponse.json({
      message: "Product Set Created Successfully"
    }, { status: 200 });

  } catch (error) {
    logError("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};