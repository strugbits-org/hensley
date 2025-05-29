import { NextResponse } from "next/server";
import { createWixClient } from "@/utils";

export const POST = async (req) => {
  const cartId = await req.json();
  try {
    const wixClient = await createWixClient();
    const cart = await wixClient.cart.getCart(cartId);

    return NextResponse.json(
      {
        message: "Cart fetched Successfully",
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
