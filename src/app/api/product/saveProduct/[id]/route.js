import { NextResponse } from "next/server";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { createWixClient } from "@/utils";

export const GET = async (req, context) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);

    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { params } = context;
    const id = params.id;

    const wixClient = await createWixClient();
    const productsData = await wixClient.items.query("ProductsSearchContent").eq("product", id).find();
    if (productsData.items.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const memberId = authenticatedUserData.memberId;
    let product = productsData.items[0];
    let membersData = product.members;

    await wixClient.items.update("ProductsSearchContent", {
      ...product,
      members: membersData ? [...membersData, memberId] : [memberId],
    });

    return NextResponse.json(
      { message: "Product saved successfully" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
