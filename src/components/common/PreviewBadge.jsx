// Presentational-only cue shown when a page is rendered from a valid preview
// token. No exit button needed in the stateless model — removing ?preview from
// the URL (or navigating away) returns to the published view.
export default function PreviewBadge() {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                textAlign: "center",
                padding: "6px 16px",
                backgroundColor: "#111827",
                color: "#fff",
                fontSize: "13px",
                letterSpacing: "0.02em",
                fontFamily: "var(--font-neue-haas-display-regular), sans-serif",
            }}
        >
            Preview — viewing unpublished draft content
        </div>
    );
}
