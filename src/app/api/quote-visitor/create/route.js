import { createWixClient, createWixClientOAuth, formatLineItemsForQuote, logError } from "@/utils";
import { NextResponse } from "next/server";

async function fetchData(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function createContact(payload) {
  try {
    const wixClient = await createWixClient();
    const response = await wixClient.contacts.createContact(payload.info, payload.options);
    return response.contact;
  } catch (error) {
    throw new Error(`Create contact failed, Error: ${error}`);
  }
}

export const POST = async (req) => {
  try {
    const wixClient = await createWixClient();
    const body = await req.json();
    const { cartId, lineItems, quoteDetails } = body;
    const lineItemIds = lineItems.map((item) => item._id);
    const formattedLineItems = formatLineItemsForQuote(lineItems);

    const dataToInsert = {
      // quoteNumber: quoteNumber,
      // quoteId: quoteId,
      orderStatus: quoteDetails.orderType,
      eventDate: quoteDetails.eventDate,
      deliveryDate: quoteDetails.deliveryDate,
      pickupDate: quoteDetails.pickupDate,
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
      phoneNumber: quoteDetails.phoneNumber,
      // memberId: memberId,
      // lineItems: cartLineItems
    }
    // await wixClient.items.insert('QuoteRequest', dataToInsert);

    return NextResponse.json(
      {
        cartId,
        lineItems,
        quoteDetails,
        dataToInsert,
        message: "Price Quote Created",
      },
      { status: 200 }
    );

    const {
      orderType,
      eventDate,
      deliveryDate,
      pickupDate,
      eventLocation,
      eventDescription,
      billTo,
      address,
      address2,
      city,
      state,
      zipCode,
      instructions,
      onSiteContact,
      telephone,
      preferredSalesPerson,
      customerName,
      customerEmail,
    } = quoteDetails;

    let formattedDeliveryDate = new Date(deliveryDate);
    let formattedPickupDate = new Date(pickupDate);
    let formattedEventDate = new Date(eventDate);

    let customerObj = {
      orderis: orderType,
      eventDate: formattedEventDate.toISOString(),
      dilvDate: formattedDeliveryDate.toISOString(),
      pickupDate: formattedPickupDate.toISOString(),
      eventLocation: eventLocation,
      eventDescript: eventDescription,
      billingDetails: {
        customerAccNameToBill: billTo,
        streetAddress: address,
        addressline2: address2 ? address2 : "",
        city: city ? city : "",
        state: state ? state : "",
        zipCode: zipCode ? zipCode : "",
        specialInstructionsText: instructions ? instructions : "",
        onSiteContact: onSiteContact,
        telephone: telephone,
        nameeOrderedBy: customerName,
        emaillOrderedBy: customerEmail,
        prefferedSalesPerson: preferredSalesPerson ? preferredSalesPerson : "",
      },
    };

    const contactInfo = {
      "info": {
        "emails": {
          "items": [
            {
              "tag": "UNTAGGED",
              "primary": false,
              "email": customerEmail
            }
          ]
        },
      },
      "options": {
        allowDuplicates: true
      }
    }
    const contact = await createContact(contactInfo);

    let customer = {
      email: customerEmail,
      contactId: contact._id,
      address: {
        city: "",
      },
      billingAddress: {
        country: "USA",
        streetAddress: {
          value: address,
          type: "Name",
        },
        addressLine: address,
        addressLine2: address2,
        postalCode: zipCode,
        subdivision: "",
        city: city,
      },
      shippingAddress: {
        country: "",
        streetAddress: {
          value: eventLocation,
          type: "Name",
        },
      },
      phone: telephone,
      fullName: customerName,
    };

    const customerData = {
      firstName: customerName,
      lastName: "",
      userEmail: customerEmail,
      phone: telephone
    }

    const payload = {
      title: eventDescription,
      customer: customer,
      quoteDetails: customerObj,
      customerData: customerData,
      lineItems,
      paymentTerms: {
        termData: "",
        termType: "DueOnReceipt",
      },
      dates: {
        issueDate: new Date(),
        validThroughDate: new Date(
          new Date().setDate(new Date().getDate() + 30)
        ),
      },
    };

    await fetchData(`${process.env.RENTALS_URL}/rentalsPriceQuote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const wixClientForCart = await createWixClientOAuth();
    await wixClientForCart.cart.removeLineItems(cartId, lineItemIds);

    return NextResponse.json(
      {
        message: "Price Quote Created",
      },
      { status: 200 }
    );
  } catch (error) {
    logError("error", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};