import { NextResponse } from "next/server";
import { logError } from "@/utils";
import { getOrCreateVisitorCart } from "@/services/cart/payloadCart";

export const POST = async () => {
  try {
    const visitorId = crypto.randomUUID();
    await getOrCreateVisitorCart(visitorId);

    return NextResponse.json(
      {
        message: "Cart created Successfully",
        // _id matches what getCartId() stores in the cartId cookie
        cart: { _id: visitorId },
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Error creating visitor cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
