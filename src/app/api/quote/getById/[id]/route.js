import { createWixClient, logError } from "@/utils";
import { NextResponse } from "next/server";

export const GET = async (_req, context) => {
  try {
    const { params } = context;
    const id = params.id;

    const wixClient = await createWixClient();
    const data = await wixClient.items.get("RequestQuote", id);

    if (!data.lineItems.length) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    };

    return NextResponse.json(
      {
        message: "Quotes Successfully fetched",
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const dynamic = "force-dynamic";
