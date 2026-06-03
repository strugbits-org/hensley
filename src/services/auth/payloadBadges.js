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

export const payloadMemberHasBadge = (member = {}, badgeId = ADMIN_BADGE_ID) => {
  const normalizedId = String(badgeId || "").trim().toLowerCase();
  if (!normalizedId) return false;

  // Match by badge ID. Works for both raw IDs (depth=0) and populated objects.
  const rawBadges = Array.isArray(member?.badges) ? member.badges : [];
  return rawBadges.some((b) => {
    const id = typeof b === "string" ? b : b?.id || b?._id || "";
    return String(id).trim().toLowerCase() === normalizedId;
  });
};