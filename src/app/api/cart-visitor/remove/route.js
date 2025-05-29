import { NextResponse } from "next/server";
import { createWixClient } from "@/Utils/CreateWixClient";
import { logError } from "@/utils";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId, lineItemIds } = body;

    const wixClient = await createWixClient();
    await wixClient.cart.removeLineItems(
      cartId,
      lineItemIds
    );

    return NextResponse.json(
      { message: "Cart item removed Successfully" },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
