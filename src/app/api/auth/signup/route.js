import { NextResponse } from "next/server";
import { logError } from "@/utils";
import { payloadRegister, payloadLogin } from "@/services/auth/payloadAuth";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phone, cartId } = body;

    // Register new member with Payload CMS
    await payloadRegister({ email, password, firstName, lastName, phone });

    // Auto-login after registration to get the token
    // Note: Payload creates members with "Pending" status by default
    // If auto-login fails due to pending status, we still return success
    let loginResponse;
    try {
      loginResponse = await payloadLogin(email, password);
    } catch (loginError) {
      // If login fails (e.g., account pending verification), return success without token
      return NextResponse.json(
        {
          message: "Account created successfully. Please check your email to verify your account.",
          requiresVerification: true,
        },
        { status: 200 }
      );
    }

    const { user, token, exp } = loginResponse;

    // Handle cart merge if cartId is provided
    // TODO: Implement cart merge with new cart system when ready
    if (cartId) {
      console.log("Cart merge pending migration, cartId:", cartId);
    }

    // Prepare response data
    const finalData = {
      memberId: user.id,
      loginEmail: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mainPhone: user.metadata?.phone || phone || "",
    };

    return NextResponse.json(
      {
        message: "Account created successfully",
        jwtToken: token,
        member: finalData,
        userTokens: { token, exp },
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    
    // Map error messages
    let message = error.message;
    if (message.includes("already exists") || message.includes("duplicate")) {
      message = "Email already exists. Please use a different email or sign in.";
    }
    
    return NextResponse.json({ message }, { status: 500 });
  }
};
