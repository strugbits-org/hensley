import { NextResponse } from "next/server";
import { createWixClientCart } from "@/utils";
import handleAuthentication from "@/services/auth/handleAuthentication";

const addItemToCart = async (cartClient) => {
  return await cartClient.currentCart.addToCurrentCart({
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
};

const handleCartResponse = (cart, message = "Cart Successfully fetched", status = 200) => {
  return NextResponse.json({ message, cart }, { status });
};

const createNewCart = async (memberTokens) => {
  try {
    const cartClient = await createWixClientCart(memberTokens);
    const cart = await addItemToCart(cartClient);
    return handleCartResponse(cart.cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req) => {
  const memberTokens = await req.json();
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cartClient = await createWixClientCart(memberTokens);
    const cart = await cartClient.currentCart.getCurrentCart();
    return handleCartResponse(cart);
  } catch (error) {
    if (error?.details?.applicationError?.code === "OWNED_CART_NOT_FOUND") {
      return await createNewCart(memberTokens);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};