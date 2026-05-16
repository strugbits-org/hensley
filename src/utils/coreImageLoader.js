import { generateCoreImageURL } from "./generateImageURL";

// next/image custom loader for Core CDN transform URLs.
//
// Wire this into a specific <Image> via the `loader` prop (not the global
// next.config.mjs loader, which would also intercept static asset imports).
//
// next/image calls this with { src, width, quality } and expects a string.
// - For Core CDN URLs the helper appends ?w=&q=&f=webp.
// - For non-transform URLs (Wix, /api/media/file/*, static imports) the
//   helper passes the src through unchanged.
//
// The `src` passed in may already carry transform params (e.g. the caller
// did `resolveCoreMediaUrl(media, "card")` which appended ?w=1024 before the
// loader sees it). generateCoreImageURL drops any existing query and rebuilds
// it from the current opts, so next/image's per-width srcset generation
// always produces clean `?w=<bucket>` URLs without duplicates.
//
// Usage:
//   import coreImageLoader from "@/utils/coreImageLoader";
//   <Image src={url} loader={coreImageLoader} width={500} height={500} sizes="..." />
export default function coreImageLoader({ src, width, quality }) {
  return generateCoreImageURL({ url: src, w: width, q: Number(quality) || 75 });
}
