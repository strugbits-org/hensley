import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { createWixClient } from "@/Utils/CreateWixClient";
import { isValidPassword } from "@/Utils/AuthApisUtils";
import logError from "@/Utils/ServerActions";

export const PUT = async (req) => {
  const body = await req.json();
  const { password } = body;

  const params = req.nextUrl.searchParams;
  const userId = params.get("reset-id");

  if (!userId) {
    return NextResponse.json({ message: "Invalid User Id" }, { status: 400 });
  }

  try {
    const invalidPassword = isValidPassword(password);
    if (!invalidPassword) {
      return NextResponse.json(
        {
          message:
            "Password must have 1 uppercase, 1 lowercase, 1 number, 1 symbol, minimum 6 characters",
        },
        { status: 404 }
      );
    }

    const wixClient = await createWixClient();

    const userData = await wixClient.items.get("membersPassword", userId);

    if (!userData._id) {
      return NextResponse.json({ message: "No User found" }, { status: 400 });
    }

    const currentDate = new Date();
    const storedDate = new Date(userData.emailToken);

    if (currentDate > storedDate) {
      return NextResponse.json(
        { message: "Your link is expired" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await wixClient.items.update("membersPassword", {
      ...userData,
      userPassword: hashedPassword,
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    logError("error", error);
    return NextResponse.json(
      { message: "Invalid token", reason: error.message },
      { status: 400 }
    );
  }
};
