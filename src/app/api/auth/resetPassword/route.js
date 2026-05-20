import { NextResponse } from "next/server";
import { logError } from "@/utils";
import { payloadResetPassword } from "@/services/auth/payloadAuth";
import { apiKeySDK, MEMBER_COLLECTION } from "@/services/payloadSDK";

const sdk = apiKeySDK();

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

    const result = await payloadResetPassword(resetToken, password);

    // Payload's resetPassword writes hash/salt via the DB layer and bypasses
    // beforeChange hooks, so the flag-clearing hook in bps-core never fires
    // here. Clear it explicitly so the user isn't re-prompted on next login.
    const userId = result?.user?.id || result?.doc?.id;
    if (userId) {
      try {
        const member = await sdk.findByID({
          collection: MEMBER_COLLECTION,
          id: userId,
          depth: 0,
        });
        await sdk.update({
          collection: MEMBER_COLLECTION,
          id: userId,
          data: {
            metadata: { ...(member?.metadata ?? {}), forcePasswordReset: false },
          },
        });
      } catch (clearErr) {
        logError("Failed to clear forcePasswordReset:", clearErr);
      }
    }

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
