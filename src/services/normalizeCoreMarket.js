import { resolveCoreMediaUrl } from "@/utils";

const normalizeMarketSlug = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.startsWith("/") ? value : `/${value}`;
};

const resolveRelationshipId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return resolveRelationshipId(value[0]);
  if (typeof value === "object") return value.id || value._id || value.value || null;
  return null;
};

export const normalizeCoreMarketItem = (item = {}) => {
  const slug = normalizeMarketSlug(item.slug || item.path || item.url);
  const heroImage = resolveCoreMediaUrl(item.heroBackground || item.featuredImage, "tablet");
  const cardImage = resolveCoreMediaUrl(item.featuredImage || item.heroBackground, "card");

  return {
    ...item,
    _id: item._id || item.id,
    id: item.id || item._id,
    title: item.title || "",
    slug,
    orderNumber: item.orderNumber ?? item.order ?? 0,
    description: item.description || "",
    tagline: item.tagline || "",
    image1: heroImage || cardImage,
    featuredImage: cardImage || heroImage,
    heroBackground: heroImage || cardImage,
    headerCoverImage: cardImage || heroImage,
    buttonLabel: item.buttonLabel || "DISCOVER",
    buttonLabelMenu: item.buttonLabelHeader || item.buttonLabel || "SEE MORE",
    buttonLink: item.buttonLink || (slug ? `/market${slug}` : ""),
    content1: item.content || null,
    video: resolveCoreMediaUrl(item.video),
    bestSellerCollection: resolveRelationshipId(item.bestSellerCollection),
    marketsOld: resolveRelationshipId(item.marketsOld),
    howWeDoIt: Array.isArray(item.howWeDoIt) ? item.howWeDoIt : [],
  };
};
