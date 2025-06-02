import { createWixClientOAuth, formatDescriptionLines, formatLineItemsForQuote, logError } from "@/utils";
import { NextResponse } from "next/server";

async function fetchData(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { cartId, lineItems, quoteDetails } = body;

    // Process line items once and extract needed data
    const lineItemIds = lineItems.map((item) => item._id);
    const formattedLineItems = formatLineItemsForQuote(lineItems);

    const cartLineItems = lineItems.map((item) => {
      const formattedDescription = formatDescriptionLines(item.descriptionLines);
      const size = formattedDescription.find(x => x.title === "size")?.value || "—";
      return {
        product: item,
        size: size,
      };
    });

    // Create shared data object to avoid duplication
    const eventDate = new Date(quoteDetails.eventDate);
    const deliveryDate = new Date(quoteDetails.deliveryDate);
    const pickupDate = new Date(quoteDetails.pickupDate);

    const sharedQuoteData = {
      orderStatus: quoteDetails.orderType,
      eventDate,
      deliveryDate,
      pickupDate,
      eventLocation: quoteDetails.eventLocation,
      eventDescriptionPo: quoteDetails.eventDescription,
      billTo: quoteDetails.billTo,
      streetAddress: quoteDetails.streetAddress,
      addressLine2: quoteDetails.addressLine2,
      city: quoteDetails.city,
      city1: quoteDetails.city1,
      state: quoteDetails.state,
      state1: quoteDetails.state1,
      zipCode: quoteDetails.zipCode,
      comments: quoteDetails.specialInstructions,
      name: quoteDetails.name,
      email: quoteDetails.email,
    };

    const payload = {
      data: sharedQuoteData,
      phone: quoteDetails.phoneNumber,
      formattedLineItems
    };

    // Initialize Wix client early to run in parallel with quote creation
    const wixClientPromise = createWixClientOAuth();

    // Create price quote
    const response = await fetchData(`https://www.hensleyeventresources.com/_functions/createPriceQuote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const quote = response.data;
    // Prepare data for database insertion
    const dataToInsert = {
      ...sharedQuoteData,
      quoteNumber: quote.number,
      quoteId: quote.id.id,
      phoneNumber: quoteDetails.phoneNumber,
      lineItems: cartLineItems
    };

    // Wait for Wix client and perform both operations in parallel
    const wixClient = await wixClientPromise;
    await Promise.all([
      wixClient.items.insert('QuoteRequest', dataToInsert),
      wixClient.cart.removeLineItems(cartId, lineItemIds)
    ]);

    return NextResponse.json(
      {
        message: "Price Quote Created Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    logError("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};