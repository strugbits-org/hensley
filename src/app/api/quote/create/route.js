import handleAuthentication from "@/services/auth/handleAuthentication";
import { createMemberQuote } from "@/services/quotes/payloadQuotes";
import { removeFromCart } from "@/services/cart/payloadCart";
import { logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { lineItems, quoteDetails } = body;
    const memberId = authenticatedUserData.memberId;
    const token = authenticatedUserData.token;

    // Get line item IDs for cart removal
    const lineItemIds = lineItems.map((item) => item._id || item.id);

    // Create quote in Payload
    const quote = await createMemberQuote(memberId, token, lineItems, quoteDetails);

    // Remove items from cart after successful quote creation
    if (lineItemIds.length > 0) {
      try {
        await removeFromCart(memberId, token, lineItemIds);
      } catch (cartError) {
        // Log but don't fail the quote creation if cart removal fails
        logError("Error removing items from cart after quote creation:", cartError);
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
    logError("Error creating quote:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};