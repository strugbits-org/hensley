import { NextResponse } from "next/server";
import { createWixClientCart, logError } from "@/utils";
import handleAuthentication from "@/services/auth/HandleAuthentication";

// POST method handler
export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { memberTokens, lineItems } = body;

    const cartClient = await createWixClientCart(memberTokens);

    await cartClient.currentCart.updateCurrentCartLineItemQuantity(lineItems);

    return NextResponse.json(
      { message: "Cart updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
