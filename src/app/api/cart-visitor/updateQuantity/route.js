import { logError } from "@/utils";
import { createWixClient } from "@/Utils/CreateWixClient";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId, lineItems } = body;

    const wixClient = await createWixClient();
    await wixClient.cart.updateLineItemsQuantity(
      cartId,
      lineItems
    );

    return NextResponse.json(
      { message: "Cart updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
