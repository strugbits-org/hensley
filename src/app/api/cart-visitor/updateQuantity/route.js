import { NextResponse } from "next/server";
import { logError } from "@/utils";
import { updateVisitorCartQuantity } from "@/services/cart/payloadCart";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId: visitorId, lineItems } = body;

    const updatedCart = await updateVisitorCartQuantity(visitorId, lineItems);

    return NextResponse.json(
      { message: "Cart updated Successfully", cart: updatedCart },
      { status: 200 }
    );
  } catch (error) {
    logError("Error updating visitor cart quantity:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
