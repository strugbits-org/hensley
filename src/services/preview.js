import { logError } from "@/utils";

// Collections that bps-core's contentVariants plugin enables preview on.
const PREVIEW_COLLECTIONS = new Set(["markets", "blogs", "projects", "pages", "sections"]);

/**
 * Stateless preview gate. Given the `?preview=<token>` value from the URL,
 * asks bps-core whether the token is still valid (signature + expiry +
 * stored-token match) via GET /api/{collection}/preview?token=. Because this
 * runs on every render, revoking the token in the CMS turns preview off
 * immediately — there is no cookie/session to outlive it.
 *
 * Returns one of three states so the page can react accordingly:
 *   - no token in URL        -> { isPreview: false, invalid: false }  (normal visitor; no core call)
 *   - token present & valid  -> { isPreview: true,  invalid: false }  (show draft + badge)
 *   - token present, rejected-> { isPreview: false, invalid: true }   (revoked/expired; show toast)
 */
export const getPreviewState = async (token, collection) => {
    const raw = Array.isArray(token) ? token[0] : token;
    if (!raw || typeof raw !== "string") return { isPreview: false, invalid: false };
    if (!PREVIEW_COLLECTIONS.has(collection)) return { isPreview: false, invalid: false };

    try {
        const res = await fetch(
            `${process.env.CORE_API_BASE_URL}/api/${collection}/preview?token=${encodeURIComponent(raw)}`,
            {
                headers: { Authorization: `Bearer ${process.env.CORE_API_KEY}` },
                cache: "no-store",
            }
        );
        if (res.ok) return { isPreview: true, invalid: false };
        // 401/410 etc. — token was revoked, expired, or no longer matches.
        return { isPreview: false, invalid: true };
    } catch (error) {
        logError("Error validating preview token:", error);
        return { isPreview: false, invalid: true };
    }
};
