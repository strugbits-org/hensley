import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { logError } from "@/utils";

export const dynamic = "force-dynamic";

/**
 * POST /api/revalidate
 *
 * On-demand cache invalidation for the storefront. Called by trusted backends
 * (e.g. the Core admin) to refresh content immediately instead of waiting for
 * the time-based ISR window (REVALIDATE_TIME).
 *
 * Auth:   header `x-revalidate-token` must equal process.env.REVALIDATE_TOKEN
 * Body:   { paths?: string[], layout?: boolean }
 *           - paths:  storefront paths to revalidate, e.g. ["/product/my-tent"]
 *           - layout: when true, also revalidates the root layout (whole site)
 * Return: { ok, revalidated, layout, now } or { ok:false, error }
 */
export const POST = async (req) => {
  try {
    const secret = process.env.REVALIDATE_TOKEN;

    // Fail closed: if no token is configured the endpoint must not run.
    if (!secret) {
      logError("Revalidation endpoint called but REVALIDATE_TOKEN is not configured");
      return NextResponse.json(
        { ok: false, error: "Revalidation is not configured on the server." },
        { status: 503 },
      );
    }

    const provided = req.headers.get("x-revalidate-token");
    if (!provided || provided !== secret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const rawPaths = Array.isArray(body?.paths) ? body.paths : [];
    const revalidateLayout = body?.layout === true;

    // Normalise to absolute, single-leading-slash paths and de-duplicate.
    const paths = Array.from(
      new Set(
        rawPaths
          .filter((p) => typeof p === "string" && p.trim().length > 0)
          .map((p) => {
            const trimmed = p.trim();
            return trimmed.startsWith("/") ? trimmed.replace(/\/{2,}/g, "/") : `/${trimmed}`;
          }),
      ),
    );

    if (paths.length === 0 && !revalidateLayout) {
      return NextResponse.json(
        { ok: false, error: "Provide at least one path to revalidate." },
        { status: 400 },
      );
    }

    const revalidated = [];
    for (const path of paths) {
      revalidatePath(path);
      revalidated.push(path);
    }

    if (revalidateLayout) {
      revalidatePath("/", "layout");
    }

    return NextResponse.json(
      { ok: true, revalidated, layout: revalidateLayout, now: Date.now() },
      { status: 200 },
    );
  } catch (error) {
    logError("Error in revalidate endpoint:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Revalidation failed" },
      { status: 500 },
    );
  }
};
