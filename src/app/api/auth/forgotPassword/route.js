import { logError } from "@/utils";
import { NextResponse } from "next/server";
import { payloadForgotPassword } from "@/services/auth/payloadAuth";

export const POST = async (req) => {
  const body = await req.json();
  const { email } = body;
  try {
    await payloadForgotPassword(email);

    return NextResponse.json(
      { message: "Email has been sent" },
      { status: 200 }
    );
  } catch (error) {
    const message = `Error sending email: ${error.message}`;
    logError(message);
    // Payload always returns success for security, but if there's an error we still handle it
    return NextResponse.json({ message: "Email has been sent" }, { status: 200 });
  }
};
