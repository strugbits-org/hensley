import { NextResponse } from "next/server";
import { logError } from "@/utils";
import { payloadLogin } from "@/services/auth/payloadAuth";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { email, password, cartId } = body;

    // Authenticate with Payload CMS
    const loginResponse = await payloadLogin(email, password);
    const { user, token, exp } = loginResponse;

    // Handle cart merge if cartId is provided
    // TODO: Implement cart merge with new cart system when ready
    if (cartId) {
      // Cart merge logic will be implemented when cart system is migrated
      console.log("Cart merge pending migration, cartId:", cartId);
    }

    // Prepare response data matching the expected format
    const finalData = {
      memberId: user.id,
      loginEmail: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mainPhone: user.metadata?.phone || "",
    };

    return NextResponse.json(
      {
        message: "Login successful",
        jwtToken: token,
        member: finalData,
        userTokens: { token, exp }, // Keep structure for compatibility
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    
    // Map Payload error messages to user-friendly messages
    let message = error.message;
    if (message.includes("Invalid credentials") || message.includes("401")) {
      message = "Invalid email or password. Please try again.";
    } else if (message.includes("suspended")) {
      message = "Your account has been suspended. Please contact support.";
    } else if (message.includes("pending")) {
      message = "Your account is pending verification. Please check your email.";
    } else if (message.includes("locked") || message.includes("429")) {
      message = "Too many failed attempts. Please try again later.";
    }
    
    return NextResponse.json({ message }, { status: 500 });
  }
};