import { NextResponse } from "next/server";
import { createWixClient, logError } from "@/utils";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId, productData } = body;

    const wixClient = await createWixClient();
    await wixClient.cart.addToCart(cartId, productData);

    return NextResponse.json(
      { message: "Product added to cart" },
      { status: 200 }
    );
  } catch (error) {
    logError("Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
