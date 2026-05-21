const ADMIN_BADGE_SLUG = (process.env.ADMIN_BADGE_SLUG || "hensley-admin").trim().toLowerCase();
const ADMIN_BADGE_ID = (process.env.ADMIN_BADGE_ID || "").trim().toLowerCase();

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.docs)) return value.docs;
  if (Array.isArray(value?.items)) return value.items;
  return value ? [value] : [];
};

const unwrapBadgeValue = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap(unwrapBadgeValue);
  }

  if (Array.isArray(value?.docs) || Array.isArray(value?.items)) {
    return toArray(value).flatMap(unwrapBadgeValue);
  }

  if (typeof value === "object" && "value" in value) {
    return unwrapBadgeValue(value.value);
  }

  if (typeof value === "object" && value?.badge) {
    return unwrapBadgeValue(value.badge);
  }

  return [value];
};

export const getPayloadMemberBadgeSlugs = (member = {}) => {
  const badgeCandidates = unwrapBadgeValue(member?.badges);

  return [...new Set(
    badgeCandidates
      .map((badge) => {
        if (typeof badge === "string") {
          return badge.trim().toLowerCase();
        }

        if (badge && typeof badge === "object" && typeof badge.slug === "string") {
          return badge.slug.trim().toLowerCase();
        }

        return "";
      })
      .filter(Boolean)
  )];
};

export const payloadMemberHasBadge = (member = {}, slug = ADMIN_BADGE_SLUG) => {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  if (!normalizedSlug) return false;

  // Check by slug (when badges are populated objects)
  if (getPayloadMemberBadgeSlugs(member).includes(normalizedSlug)) return true;

  // Fallback: check by raw badge ID when badges aren't populated (depth=0)
  // This handles the case where Payload returns raw IDs instead of objects
  if (ADMIN_BADGE_ID && normalizedSlug === ADMIN_BADGE_SLUG) {
    const rawBadges = Array.isArray(member?.badges) ? member.badges : [];
    return rawBadges.some((b) => {
      const id = typeof b === "string" ? b : b?.id || b?._id || "";
      return id.trim().toLowerCase() === ADMIN_BADGE_ID;
    });
  }

  return false;
};