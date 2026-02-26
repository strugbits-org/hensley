import handleAuthentication from "@/services/auth/handleAuthentication";
import { logError } from "@/utils";
import { NextResponse } from "next/server";
import { payloadUpdateProfile } from "@/services/auth/payloadAuth";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phone } = body;
    const { memberId, token } = authenticatedUserData;

    // Update profile in Payload CMS
    const updatedData = {
      firstName,
      lastName,
      metadata: { phone },
    };
    
    const response = await payloadUpdateProfile(memberId, token, updatedData);

    const updatedMember = {
      loginEmail: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      mainPhone: response.metadata?.phone || phone,
      memberId,
    };

    return NextResponse.json(
      { message: "Profile updated successfully", updatedMember },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
