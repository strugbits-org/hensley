import { createVisitorQuote } from "@/services/quotes/payloadQuotes";
import { removeFromVisitorCart } from "@/services/cart/payloadCart";
import { logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId, lineItems, quoteDetails } = body;

    // Get line item IDs for cart removal
    const lineItemIds = lineItems.map((item) => item._id || item.id);

    // Use cartId as visitorId for the quote
    const visitorId = cartId;

    // Create quote in Payload
    const quote = await createVisitorQuote(visitorId, lineItems, quoteDetails);

    // Remove items from cart after successful quote creation
    if (lineItemIds.length > 0 && visitorId) {
      try {
        await removeFromVisitorCart(visitorId, lineItemIds);
      } catch (cartError) {
        // Log but don't fail the quote creation if cart removal fails
        logError("Error removing items from visitor cart after quote creation:", cartError);
      }
    }

    return NextResponse.json(
      {
        message: "Price Quote Created Successfully",
        quote: {
          id: quote.id,
          quoteNumber: quote.quoteNumber,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Error creating visitor quote:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};