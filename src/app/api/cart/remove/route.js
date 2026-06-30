import { NextResponse } from "next/server";
import { logError } from "@/utils";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { isAuthError } from "@/services/auth/authErrors";
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
    const status = isAuthError(error) ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
};
