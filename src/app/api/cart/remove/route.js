import { NextResponse } from "next/server";
import { logError } from "@/utils";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { removeFromCart } from "@/services/cart/payloadCart";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { lineItemIds } = body;

    const updatedCart = await removeFromCart(
      authenticatedUserData.memberId,
      authenticatedUserData.token,
      lineItemIds
    );

    return NextResponse.json(
      { 
        message: "Cart item removed Successfully",
        cart: updatedCart
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Error removing from cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
