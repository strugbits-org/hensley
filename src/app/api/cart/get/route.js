import { NextResponse } from "next/server";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { getOrCreateCart } from "@/services/cart/payloadCart";

const handleCartResponse = (cart, message = "Cart Successfully fetched", status = 200) => {
  return NextResponse.json({ message, cart }, { status });
};

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await getOrCreateCart(
      authenticatedUserData.memberId,
      authenticatedUserData.token
    );

    return handleCartResponse(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};