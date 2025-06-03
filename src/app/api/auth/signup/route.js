import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createWixClientCart, createWixClientOAuth, isValidEmail, logError } from "@/utils";

export const POST = async (req) => {
  try {
    const body = await req.json();

    const { email, password, firstName, lastName, phone } = body;

    const wixClient = await createWixClientOAuth();

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          message: "Enter a valid email address",
        },
        { status: 404 }
      );
    }

    const memberData = await wixClient.items.query("membersPassword").eq("userEmail", email).find();

    if (memberData.items.length > 0) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 403 }
      );
    }

    let jwtToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const memberResponse = await fetch(
      `${process.env.RENTALS_URL}/createRentalsMember`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName, phone }),
      }
    );

    const responseData = await memberResponse.json();
    const memberResponseData = responseData.data;

    if (!memberResponseData) {
      return NextResponse.json(
        { message: "Error saving member data, please try again" },
        { status: 500 }
      )
    }

    const memberId = memberResponseData._id;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await wixClient.items.insert("membersPassword", {
        userEmail: email,
        userPassword: hashedPassword,
      });
    } catch (error) {
      return NextResponse.json(
        { message: "Error saving member data: " + error.message },
        { status: 500 }
      );
    }

    const memberTokens = await wixClient.auth.getMemberTokensForExternalLogin(
      memberId,
      process.env.CLIENT_API_KEY_WIX
    );

    if (body?.cartId) {
      const wixClient = await createWixClientOAuth();
      const visitorCart = await wixClient.cart.getCart(body.cartId);

      const cartClient = await createWixClientCart(memberTokens);
      const lineItems = visitorCart.lineItems.map(x => ({
        catalogReference: x.catalogReference,
        quantity: x.quantity
      }));

      if (lineItems.length !== 0) {
        await cartClient.currentCart.addToCurrentCart({ lineItems });
      }
    }

    const finalData = {
      memberId: memberResponseData._id,
      loginEmail: email,
      firstName: firstName,
      lastName: lastName,
      mainPhone: phone
    };

    return NextResponse.json(
      {
        message: "User registered successfully",
        jwtToken,
        member: finalData,
        userTokens: memberTokens,
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Error", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
