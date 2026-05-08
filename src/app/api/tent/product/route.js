import { NextResponse } from "next/server";
import { fetchAllTents, fetchTentData } from "@/services/tents";
import { logError } from "@/utils";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get("slug") || "";
    const rawId = searchParams.get("id") || "";

    const slug = String(rawSlug)
      .replace(/^\/+/, "")
      .replace(/^tent\//i, "")
      .replace(/\/+$/, "");
    const id = String(rawId || "").trim();

    if (!slug && !id) {
      return NextResponse.json({ error: "slug or id is required" }, { status: 400 });
    }

    let tentData = null;
    if (slug) {
      tentData = await fetchTentData(slug);
    }

    if (!tentData && id) {
      const tents = await fetchAllTents();
      tentData = (tents || []).find((item) => {
        const candidateIds = [
          item?._id,
          item?.id,
          item?.tent?._id,
          item?.tent?.id,
          item?.productData?._id,
          item?.productData?.id,
        ]
          .filter(Boolean)
          .map(String);
        return candidateIds.includes(id);
      });
    }

    const product = tentData?.tent || tentData?.productData || tentData?.product || tentData;

    if (!product) {
      return NextResponse.json({ error: "Tent not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    logError("Error fetching tent product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
