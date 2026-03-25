import { NextResponse } from "next/server";
import { logError } from "@/utils";
import { removeFromVisitorCart, addToVisitorCart } from "@/services/cart/payloadCart";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId: visitorId, id, productData } = body;

    await removeFromVisitorCart(visitorId, [id]);
    const lineItems = productData?.lineItems || [];
    const updatedCart = await addToVisitorCart(visitorId, lineItems);

    return NextResponse.json(
      { message: "Cart item updated Successfully", cart: updatedCart },
      { status: 200 }
    );
  } catch (error) {
    logError("Error updating visitor cart item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
