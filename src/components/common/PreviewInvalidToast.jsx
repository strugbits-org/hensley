"use client";

import { useEffect } from "react";
import { toast } from "sonner";

// Fired when a `?preview=` token is present but rejected by core (revoked or
// expired). The page falls back to the published view; this just tells the
// editor why their preview link stopped working.
export default function PreviewInvalidToast() {
    useEffect(() => {
        toast.error("This preview link is no longer valid (revoked or expired). Showing the published version.");
    }, []);

    return null;
}
