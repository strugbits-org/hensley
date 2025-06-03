import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createWixClient, createWixClientCart, createWixClientOAuth, logError } from "@/utils";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { email, cartId } = body;
    console.log("cartId", cartId);


    const [wixClientApi, wixClient] = await Promise.all([
      createWixClient(),
      createWixClientOAuth()
    ]);

    const privateMemberData = await wixClientApi.items.query("Members/PrivateMembersData").eq("loginEmail", email).find();
    console.log("privateMemberData", privateMemberData);

    // Early return for non-existent user
    const selectedMemberData = privateMemberData.items[0];
    if (!selectedMemberData) {
      return NextResponse.json(
        { message: "No user found with the provided email" },
        { status: 401 }
      );
    };

    // Parallel token generation and member tokens retrieval
    // const [jwtToken, memberTokens] = await Promise.all([
    //   new Promise((resolve) => {
    //     resolve(jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30d" }));
    //   }),
    //   wixClient.auth.getMemberTokensForExternalLogin(
    //     selectedMemberData._id,
    //     process.env.API_KEY_WIX
    //   )
    // ]);
    // console.log("memberTokens", memberTokens);

    // Handle cart merge if cartId is provided
    // if (cartId) {
    //   try {
    //     const [visitorCart, cartClient] = await Promise.all([
    //       wixClientApi.cart.getCart(cartId),
    //       createWixClientCart(memberTokens)
    //     ]);

    //     const lineItems = visitorCart.lineItems.map(({ catalogReference, quantity }) => ({
    //       catalogReference,
    //       quantity
    //     }));

    //     if (lineItems.length > 0) {
    //       await cartClient.currentCart.addToCurrentCart({ lineItems });
    //     }
    //   } catch (cartError) {
    //     // Log cart error but don't fail the login
    //     logError(cartError);
    //   }
    // }

    const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30d" });
    
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
        // userTokens: memberTokens,
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};