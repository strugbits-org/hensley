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