import { NextResponse } from "next/server";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { createWixClient, logError } from "@/utils";

export const GET = async (req, context) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { params } = context;
    const id = params.id;
    const memberId = authenticatedUserData.memberId;

    const wixClient = await createWixClient();
    const productsData = await wixClient.items.query("FullProductData").eq("product", id).hasSome("members", [memberId]).find();

    let product = productsData.items[0];
    let membersData = product.members;

    if (productsData.items.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await wixClient.items.update("FullProductData", {
      ...product,
      members: membersData.filter((member) => member !== memberId),
    });

    return NextResponse.json(
      { message: "Saved Product removed Successfully" },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
