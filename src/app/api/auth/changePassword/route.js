import { NextResponse } from "next/server";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { logError } from "@/utils";
import { payloadLogin, payloadUpdateProfile } from "@/services/auth/payloadAuth";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { oldPassword, newPassword } = body;
    const { memberId, email, token } = authenticatedUserData;

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Old password and new password are required" },
        { status: 400 }
      );
    }

    // Verify old password by attempting to login
    try {
      await payloadLogin(email, oldPassword);
    } catch (error) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Update password via Payload PATCH endpoint
    await payloadUpdateProfile(memberId, token, { password: newPassword });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
