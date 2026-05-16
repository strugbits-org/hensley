const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || process.env.NEXT_PUBLIC_CORE_API_BASE_URL || "";

const normalizePayloadAssetUrl = (value) => {
  if (!value || typeof value !== "string") return "";

  const normalizedBaseUrl = CORE_API_BASE_URL.replace(/\/$/, "");

  if (value.startsWith('/api/media/')) {
    return normalizedBaseUrl ? `${normalizedBaseUrl}${value}` : value;
  }

  try {
    const parsed = new URL(value);
    if (parsed.pathname.startsWith('/api/media/')) {
      return normalizedBaseUrl
        ? `${normalizedBaseUrl}${parsed.pathname}${parsed.search}${parsed.hash}`
        : `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    return value;
  }

  return value;
};

export const generateImageURL = ({
  wix_url,
  original = false,
  fit = "fill",
  q = "90",
  h = "1080",
  w = "1920",
}) => {
  if (!wix_url) return "";

  // Handle object format { url: "..." } from Payload CMS
  const urlString = typeof wix_url === 'object' ? (wix_url.url || wix_url.src || '') : wix_url;
  if (!urlString || typeof urlString !== 'string') return typeof wix_url === 'string' ? wix_url : '';

  const normalizedUrl = normalizePayloadAssetUrl(urlString);
  const cleanUrl = normalizedUrl.split("#")[0];

  if (!cleanUrl.startsWith("wix:image://v1/") && !cleanUrl.startsWith("wix:vector://v1/")) {
    return normalizedUrl;
  }

  const isImage = cleanUrl.startsWith("wix:image://v1/");

  const baseURL = isImage
    ? "https://static.wixstatic.com/media/"
    : "https://static.wixstatic.com/shapes/";

  const resourceId = cleanUrl
    .replace(isImage ? "wix:image://v1/" : "wix:vector://v1/", "")
    .split("/")[0]
    .replace("#", "");

  return original
    ? baseURL + resourceId
    : `${baseURL}${resourceId}/v1/${fit}/w_${w},h_${h},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
};

export const generateImageURLAlternate = ({
  wix_url,
  original = false,
  fit = "fill",
  q = "90",
  h = "1080",
  w = "1920",
}) => {
  if (!wix_url) return "";
  
  // Handle object format { url: "..." } from Payload CMS
  const urlString = typeof wix_url === 'object' ? (wix_url.url || wix_url.src || '') : wix_url;
  if (!urlString || typeof urlString !== 'string') return typeof wix_url === 'string' ? wix_url : '';

  const normalizedUrl = normalizePayloadAssetUrl(urlString);
  
  if (!normalizedUrl.startsWith("wix:image://v1/")) return normalizedUrl;

  const baseURL = "https://static.wixstatic.com/media/";
  const urlParts = normalizedUrl.split('/');
  const imageId = urlParts[urlParts.length - 1].split('?')[0];

  return original
    ? baseURL + imageId
    : `${baseURL}${imageId}/v1/${fit}/w_${w},h_${h},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
};

export const formatProductImageURL = (url) => {
  if (!url) return "";

  const [beforeHash, afterHash] = url.split("#");
  const hashPart = afterHash ? `#${afterHash}` : "";

  if (!beforeHash.includes("v1/")) {
    return url;
  }

  const [protocol, path] = beforeHash.split("v1/");

  if (!path) return url;

  const parts = path.split("/");
  const idPart = parts[0].split("~")[0];
  const extension = path.split(".").pop();

  return `${protocol}v1/https:/${idPart}~mv2.${extension}${hashPart}`;
};

export const generateVideoURL = (videoSRC) => {

  if (videoSRC && videoSRC.startsWith("wix:video://v1/")) {
    const videoID = videoSRC.replace('wix:video://v1/', '').split('/')[0];
    return `https://video.wixstatic.com/video/${videoID}/file`;
  } else {
    return videoSRC;
  }
}

export const generateSVGURL = (wix_url) => {

  if (!wix_url.startsWith("wix:vector://v1/")) {
    return wix_url
  }
  let wixImageURL = "";
  wixImageURL = "https://static.wixstatic.com/shapes/";
  let splitUrl = wix_url.split("/")
  return wixImageURL + splitUrl[splitUrl.length - 2];

}

export const generateImageURLById = ({
  id
}) => generateImageURL({ wix_url: `wix:image://v1/${id}`, fit: "fit" });

export const generateWixDocumentUrl = (folderId, wixDocumentUrl) => {
  if (!folderId || typeof folderId !== 'string') {
    return null;
  }

  if (!wixDocumentUrl || typeof wixDocumentUrl !== 'string') {
    return null;
  }

  if (!wixDocumentUrl.startsWith('wix:document://v1/ugd/')) {
    return null;
  }
  const urlParts = wixDocumentUrl.replace('wix:document://v1/ugd/', '').split('/');
  const filePath = urlParts[0];

  if (!filePath) {
    return null;
  }

  const directUrl = `https://${folderId}.usrfiles.com/ugd/${filePath}`;

  return directUrl;
}

// ---------------------------------------------------------------------------
// Core CDN transform endpoint helpers
// ---------------------------------------------------------------------------
// The Core CDN serves images via /transform/<filename>?w=…&h=…&q=…&f=webp.
// Hitting the URL without query params returns the original. We snap requested
// widths to a fixed bucket set to keep CDN cache fragmentation under control,
// and we only emit params for fields the caller actually set (so a bare call
// with just a width doesn't carry every default through to the URL).

const CORE_WIDTH_BUCKETS = [128, 256, 360, 480, 640, 768, 1024, 1280, 1536, 1920, 2560];
const CORE_TRANSFORMABLE_EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;
// Matches paths like "/IMG_4377.JPG" but not "/api/media/file/IMG_4377.JPG"
// — used by the migration-window guard below.
const CORE_BARE_FILENAME_PATH = /^\/[^/]+\.(jpe?g|png|webp|avif|tiff?)$/i;

const snapToCoreBucket = (w) => {
  const n = Number(w);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return CORE_WIDTH_BUCKETS.find((b) => b >= n) || CORE_WIDTH_BUCKETS[CORE_WIDTH_BUCKETS.length - 1];
};

// TEMPORARY — remove once backend ships the change that makes media.url
// return CDN paths with /transform/ already in them.
// See plan: §1a in context-image-transform-endpoint-synchronous-liskov.md
//
// Today Payload returns CDN-backed image URLs as:
//   https://cdn-dev.core.blueprintstudios.com/IMG_4377.JPG
// We need:
//   https://cdn-dev.core.blueprintstudios.com/transform/IMG_4377.JPG
//
// We distinguish CDN-shaped URLs by path pattern (bare filename at the root
// with a transformable image extension) — Payload API URLs like
// /api/media/file/foo.jpg have a deeper path and pass through untouched.
const ensureCoreTransformPath = (url) => {
  if (!url || typeof url !== "string") return url;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/transform/")) return url;
    if (!CORE_BARE_FILENAME_PATH.test(parsed.pathname)) return url;
    parsed.pathname = `/transform${parsed.pathname}`;
    return parsed.toString();
  } catch {
    return url;
  }
};

/**
 * Build a Core CDN transform URL from an already-resolved media URL.
 *
 * @param {object} opts
 * @param {string} opts.url       Already-resolved URL (output of resolveCoreMediaUrl).
 * @param {number} [opts.w]       Target render width in CSS pixels (snaps up to bucket).
 * @param {number} [opts.h]       Target render height in CSS pixels.
 * @param {number} [opts.q=75]    Quality 1–100. Omitted from query when 75 (CDN default).
 * @param {string} [opts.f="webp"] Format. Omitted from query when "webp" (CDN default).
 * @param {string} [opts.fit]     fill | fit | cover | contain | crop | scale.
 * @param {string} [opts.al]      Crop alignment.
 * @param {string} [opts.bg]      Background hex for contain mode.
 * @param {boolean} [opts.sharp]  Sharpen toggle.
 * @param {boolean} [opts.original=false] If true, return the URL without any query params.
 */
export const generateCoreImageURL = ({
  url,
  w,
  h,
  q = 75,
  f = "webp",
  fit,
  al,
  bg,
  sharp,
  original = false,
} = {}) => {
  if (!url || typeof url !== "string") return "";

  const transformed = ensureCoreTransformPath(url);
  if (original) {
    // Strip any pre-existing query params so callers explicitly asking for the
    // original always get the raw file (the CDN treats no-params as original).
    const qIdx = transformed.indexOf("?");
    return qIdx >= 0 ? transformed.slice(0, qIdx) : transformed;
  }
  // Not a transform URL (legacy /api/media/file/*, Wix, SVG, video, PDF, etc.) — pass through.
  if (!transformed.includes("/transform/")) return transformed;

  // The input may already carry transform params (e.g. an upstream caller did
  // resolveCoreMediaUrl(media, "card") and appended ?w=1024). We always rebuild
  // the query string from the current options so we never end up with
  // duplicated `w=` params or stale settings.
  const baseWithoutQuery = (() => {
    const qIdx = transformed.indexOf("?");
    return qIdx >= 0 ? transformed.slice(0, qIdx) : transformed;
  })();

  const params = new URLSearchParams();
  const snappedW = snapToCoreBucket(w);
  if (snappedW) params.set("w", String(snappedW));
  if (Number.isFinite(Number(h)) && Number(h) > 0) params.set("h", String(Math.round(Number(h))));
  if (q && Number(q) !== 75) params.set("q", String(Number(q)));
  if (f && f !== "webp") params.set("f", f);
  if (fit) params.set("fit", fit);
  if (al) params.set("al", al);
  if (bg) params.set("bg", bg);
  if (sharp) params.set("sharp", "1");

  const qs = params.toString();
  return qs ? `${baseWithoutQuery}?${qs}` : baseWithoutQuery;
};

// Export so the migration-window guard can be exercised in isolation if needed.
export const __ensureCoreTransformPath = ensureCoreTransformPath;
export const isCoreTransformableExtension = (filename) =>
  typeof filename === "string" && CORE_TRANSFORMABLE_EXT.test(filename);