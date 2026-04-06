import { getQuoteById } from "@/services/quotes/payloadQuotes";
import { logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (_req, context) => {
  try {
    const { params } = context;
    const id = params.id;

    const quote = await getQuoteById(id);

    if (!quote || !quote.lineItems?.length) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Quote Successfully fetched",
        data: quote,
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Error fetching quote:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};