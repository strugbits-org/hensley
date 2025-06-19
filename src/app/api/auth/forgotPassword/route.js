import { createWixClientOAuth, logError } from "@/utils";
import { NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;

export const POST = async (req) => {
  const body = await req.json();
  const { email } = body;
  try {

    const wixClient = await createWixClientOAuth();
    await wixClient.auth.sendPasswordResetEmail(email, baseUrl);

    return NextResponse.json(
      { message: "Email has been sent" },
      { status: 200 }
    );
  } catch (error) {
    const message = `Error sending email: ${error.message}`;
    logError(message);
    return NextResponse.json({ message: "Email does not exist!" }, { status: 500 });
  }
};
