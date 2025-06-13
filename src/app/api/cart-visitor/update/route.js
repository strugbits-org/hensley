import { NextResponse } from "next/server";
import { createWixClient, logError } from "@/utils";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId, id, data } = body;

    const wixClient = await createWixClient();
    await wixClient.cart.removeLineItems(cartId, [id]);
    await wixClient.cart.addToCart(cartId, data);

    return NextResponse.json(
      { message: "Cart item updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
