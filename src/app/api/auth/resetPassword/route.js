import { NextResponse } from "next/server";
import { logError } from "@/utils";
import { payloadResetPassword } from "@/services/auth/payloadAuth";

export const dynamic = "force-dynamic";

export const PUT = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const resetToken = searchParams.get("reset-id");

    if (!resetToken) {
      return NextResponse.json(
        { message: "Reset token is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { message: "New password is required" },
        { status: 400 }
      );
    }

    await payloadResetPassword(resetToken, password);

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json(
      { message: error.message || "Password reset failed" },
      { status: 500 }
    );
  }
};
