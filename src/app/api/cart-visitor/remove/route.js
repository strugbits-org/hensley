import { NextResponse } from "next/server";
import { logError } from "@/utils";
import { removeFromVisitorCart } from "@/services/cart/payloadCart";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId: visitorId, lineItemIds } = body;

    const updatedCart = await removeFromVisitorCart(visitorId, lineItemIds);

    return NextResponse.json(
      { message: "Cart item removed Successfully", cart: updatedCart },
      { status: 200 }
    );
  } catch (error) {
    logError("Error removing from visitor cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
