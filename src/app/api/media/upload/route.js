import { NextResponse } from "next/server";
import { logError } from "@/utils";

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || "";
const CORE_API_KEY = process.env.CORE_API_KEY || "";
const CORE_TENANT_ID = process.env.CORE_TENANT_ID || "";

const toAbsoluteCoreUrl = (urlOrPath) => {
  if (!urlOrPath) return "";
  if (/^(https?:)?\/\//.test(urlOrPath)) return urlOrPath;
  return `${CORE_API_BASE_URL.replace(/\/$/, "")}${urlOrPath.startsWith("/") ? "" : "/"}${urlOrPath}`;
};

const uploadToCore = async (file, fileBuffer) => {
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer], { type: file.type }), file.name);
  if (CORE_TENANT_ID) {
    formData.append('_payload', JSON.stringify({ tenant: CORE_TENANT_ID }));
  }

  const uploadUrl = `${CORE_API_BASE_URL}/api/media`;
  
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CORE_API_KEY}`,
      'X-Tenant-Id': CORE_TENANT_ID,
      'X-Tenant': CORE_TENANT_ID,
    },
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    console.error("Core API upload error:", errorText);
    const err = new Error(`Core API upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    err.status = uploadResponse.status;
    err.details = errorText;
    err.target = uploadUrl;
    throw err;
  }

  const uploadResult = await uploadResponse.json();
  
  if (uploadResult.doc) {
    return {
      file: {
        id: uploadResult.doc.id || uploadResult.doc._id,
        url: toAbsoluteCoreUrl(uploadResult.doc.url || uploadResult.doc.filename),
      }
    };
  }
  
  return uploadResult;
};

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!CORE_TENANT_ID) {
      throw new Error("Missing CORE_TENANT_ID for core media upload");
    }

    const fileBuffer = await file.arrayBuffer();
    const uploadResult = await uploadToCore(file, fileBuffer);

    return NextResponse.json(uploadResult, { status: 200 });
  } catch (error) {
    logError("Error uploading image", error.message);
    return NextResponse.json({
      error: error.message,
      details: error.details || "Check server logs for more information",
      target: error.target || `${CORE_API_BASE_URL}/api/media`,
    }, { status: error.status || 500 });
  }
};