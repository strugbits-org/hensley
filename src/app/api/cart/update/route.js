import { NextResponse } from "next/server";
import { logError } from "@/utils";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { removeFromCart, addToCart } from "@/services/cart/payloadCart";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { id, productData } = body;

    // Remove the existing item first
    await removeFromCart(
      authenticatedUserData.memberId,
      authenticatedUserData.token,
      [id]
    );

    // Add the updated product data
    const lineItems = productData?.lineItems || [];
    const updatedCart = await addToCart(
      authenticatedUserData.memberId,
      authenticatedUserData.token,
      lineItems
    );

    return NextResponse.json(
      { 
        message: "Cart item updated Successfully",
        cart: updatedCart
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Error updating cart item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
