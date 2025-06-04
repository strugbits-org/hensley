import { createWixClientOAuth } from "@/utils";
import { NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;

export const POST = async (req) => {
  const body = await req.json();
  const { email } = body;

  const wixClient = await createWixClientOAuth();
  await wixClient.auth.sendPasswordResetEmail(email, baseUrl);

  try {
    return NextResponse.json(
      { message: "Email has been sent" },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
