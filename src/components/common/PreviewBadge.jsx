"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Presentational-only cue shown when a page is rendered from a valid preview
// token. Preview is stateless — it lives entirely in the `?preview=<token>`
// query param — so "exiting" just means navigating to the same path without it.
//
// The bar is fixed to the very top of the viewport. To keep it from covering
// the site header/menu (both also pinned to the top), we tag <body> with
// `preview-active` and expose the bar height as a CSS variable; globals.css
// then nudges the fixed header down and pads the page content so the bar sits
// *above* the menu instead of on top of it. All visual styling lives in
// globals.css under the `.preview-*` classes.
const BADGE_HEIGHT = 40; // px

export default function PreviewBadge() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const { body } = document;
        body.classList.add("preview-active");
        body.style.setProperty("--preview-badge-height", `${BADGE_HEIGHT}px`);
        return () => {
            body.classList.remove("preview-active");
            body.style.removeProperty("--preview-badge-height");
        };
    }, []);

    // Same path, minus the `preview` token — i.e. the published view.
    const publishedUrl = () => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.delete("preview");
        const query = params.toString();
        return query ? `${pathname}?${query}` : pathname;
    };

    // Leave preview in this tab. router.replace re-runs the server component
    // with no token, so the published content is fetched and the bar unmounts.
    const exitPreview = () => router.replace(publishedUrl());

    // Open the published version in a new tab. A page can't split the browser's
    // tabs itself, but the user can drag this new tab into a side-by-side view.
    const openPublished = () => {
        if (typeof window === "undefined") return;
        window.open(publishedUrl(), "_blank", "noopener,noreferrer");
    };

    return (
        <div className="preview-bar" role="status">
            <span className="preview-bar__label">
                <span className="preview-bar__dot" aria-hidden="true" />
                <span className="preview-bar__tag">Preview</span>
                <span className="preview-bar__text">
                    viewing unpublished draft content
                </span>
            </span>

            <span className="preview-bar__actions">
                <button
                    type="button"
                    className="preview-btn preview-btn--primary"
                    onClick={openPublished}
                >
                    Open published
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M14 5h5v5M19 5l-9 9M17 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    type="button"
                    className="preview-btn"
                    onClick={exitPreview}
                >
                    Exit preview
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </span>
        </div>
    );
}
