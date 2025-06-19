import { NextResponse } from "next/server";
import { createWixClient, logError } from "@/utils";

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const wixClient = await createWixClient();
    const uploadUrlResponse = await wixClient.files.generateFileUploadUrl(file.type);

    const fileBuffer = await file.arrayBuffer();
    const uploadUrl = new URL(uploadUrlResponse.uploadUrl);
    uploadUrl.searchParams.set('filename', file.name);

    const uploadResponse = await fetch(uploadUrl.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: fileBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Upload error response:", errorText);
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
    }
    const uploadResult = await uploadResponse.json();
    return NextResponse.json(uploadResult, { status: 200 });
  } catch (error) {
    logError("Error uploading image", error.message);
    return NextResponse.json({
      error: error.message,
      details: "Check server logs for more information"
    }, { status: 500 });
  }
};