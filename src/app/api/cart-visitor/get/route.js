import { NextResponse } from "next/server";
import { logError } from "@/utils";
import { getOrCreateVisitorCart } from "@/services/cart/payloadCart";

export const POST = async (req) => {
  try {
    const visitorId = await req.json();

    if (!visitorId) {
      return NextResponse.json({ error: "visitorId is required" }, { status: 400 });
    }

    const cart = await getOrCreateVisitorCart(visitorId);

    return NextResponse.json(
      { message: "Cart fetched Successfully", cart },
      { status: 200 }
    );
  } catch (error) {
    logError("Error getting visitor cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
