import PreviewBadge from "./PreviewBadge";
import PreviewInvalidToast from "./PreviewInvalidToast";

// Single entry point for all preview UI. Every previewable route resolves its
// state with getPreviewState(searchParams?.preview, "<collection>") and renders
// <PreviewChrome {...state} /> — so the badge/toast wiring stays identical
// across markets, blogs, projects, pages, etc.
//
//   const { isPreview, invalid } = await getPreviewState(searchParams?.preview, "blogs");
//   return (<><PreviewChrome isPreview={isPreview} invalid={invalid} />...</>);
export default function PreviewChrome({ isPreview = false, invalid = false }) {
    return (
        <>
            {isPreview && <PreviewBadge />}
            {invalid && <PreviewInvalidToast />}
        </>
    );
}
