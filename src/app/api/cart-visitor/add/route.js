import { NextResponse } from "next/server";
import { createWixClientApiStrategy } from "@/Utils/CreateWixClient";
import { logError } from "@/utils";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId, productData } = body;

    const wixClient = await createWixClientApiStrategy();
    await wixClient.cart.addToCart(cartId, productData);

    return NextResponse.json(
      { message: "Cart updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    logError("Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
