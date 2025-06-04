import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createWixClient, createWixClientCart, createWixClientOAuth, logError } from "@/utils";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { email, password, cartId } = body;

    const [wixClientApi, wixClient] = await Promise.all([
      createWixClient(),
      createWixClientOAuth()
    ]);

    const loginStatus = await wixClient.auth.login({ email, password });
    if (loginStatus.loginState !== "SUCCESS") {
      const errorMessage = {
        invalidEmail: "No user found with the provided email.",
        invalidPassword: "Incorrect password. Please try again.",
        resetPassword: "Password reset required. Check your email for instructions.",
      }[loginStatus.errorCode];
      throw new Error(errorMessage);
    }

    const privateMemberData = await wixClientApi.items.query("Members/PrivateMembersData").eq("loginEmail", email).find();

    // Early return for non-existent user
    const selectedMemberData = privateMemberData.items[0];
    if (!selectedMemberData) {
      return NextResponse.json(
        { message: "No user found with the provided email" },
        { status: 401 }
      );
    };

    // Parallel token generation and member tokens retrieval
    const [jwtToken, memberTokens] = await Promise.all([
      new Promise((resolve) => {
        resolve(jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30d" }));
      }),
      wixClient.auth.getMemberTokensForExternalLogin(
        selectedMemberData._id,
        process.env.API_KEY_WIX
      )
    ]);

    // Handle cart merge if cartId is provided
    if (cartId) {
      try {
        const [visitorCart, cartClient] = await Promise.all([
          wixClientApi.cart.getCart(cartId),
          createWixClientCart(memberTokens)
        ]);

        const lineItems = visitorCart.lineItems.map(({ catalogReference, quantity }) => ({
          catalogReference,
          quantity
        }));

        if (lineItems.length > 0) {
          await cartClient.currentCart.addToCurrentCart({ lineItems });
        }
      } catch (cartError) {
        // Log cart error but don't fail the login
        logError(cartError);
      }
    }

    // Prepare response data
    const finalData = {
      memberId: selectedMemberData._id,
      loginEmail: selectedMemberData.loginEmail,
      firstName: selectedMemberData.firstName,
      lastName: selectedMemberData.lastName,
      mainPhone: selectedMemberData.mainPhone,
    };

    return NextResponse.json(
      {
        message: "Login successful",
        jwtToken,
        member: finalData,
        userTokens: memberTokens,
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};