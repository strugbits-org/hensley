import handleAuthentication from "@/services/auth/handleAuthentication";
import { createWixClient, logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phone } = body;
    const { memberId } = authenticatedUserData;

    
    const updatedData = {
      contact: {
        firstName: firstName,
        lastName: lastName,
        phones: [phone],
      },
    };
    
    const wixClient = await createWixClient();
    const response = await wixClient.members.updateMember(
      memberId,
      updatedData
    );

    const updatedMember = {
      loginEmail: response.loginEmail,
      firstName: response.contact.firstName,
      lastName: response.contact.lastName,
      mainPhone: response.contact.phones[0],
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
