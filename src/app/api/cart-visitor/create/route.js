import { createWixClientOAuth, logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const wixClient = await createWixClientOAuth();
    const cartResponse = await wixClient.cart.createCart({
      lineItems: [
        {
          catalogReference: {
            appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e",
            catalogItemId: "1",
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json(
      {
        message: "Cart created Successfully",
        cart: cartResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
