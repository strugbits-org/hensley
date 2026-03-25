import { NextResponse } from "next/server";
import { logError } from "@/utils";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { updateCartQuantity } from "@/services/cart/payloadCart";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { lineItems } = body;

    const updatedCart = await updateCartQuantity(
      authenticatedUserData.memberId,
      authenticatedUserData.token,
      lineItems
    );

    return NextResponse.json(
      { 
        message: "Cart updated Successfully",
        cart: updatedCart
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Error updating cart quantity:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
