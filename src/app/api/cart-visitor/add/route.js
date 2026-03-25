import { NextResponse } from "next/server";
import { logError } from "@/utils";
import { addToVisitorCart } from "@/services/cart/payloadCart";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId: visitorId, productData } = body;

    const lineItems = productData?.lineItems || [];
    const updatedCart = await addToVisitorCart(visitorId, lineItems);

    return NextResponse.json(
      { message: "Product added to cart", cart: updatedCart },
      { status: 200 }
    );
  } catch (error) {
    logError("Error adding to visitor cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
