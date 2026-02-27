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

    // Payload returns updated doc in response.doc
    const doc = response.doc || response;
    
    const updatedMember = {
      loginEmail: doc.email || authenticatedUserData.email,
      firstName: doc.firstName || firstName,
      lastName: doc.lastName || lastName,
      mainPhone: doc.metadata?.phone || phone,
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
