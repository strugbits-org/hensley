// Distinguishes a genuine authentication failure (bad/expired/invalid token —
// the caller should drop the session) from a transient Core failure (5xx,
// network, timeout — the session must be preserved). The transient path
// deliberately uses messages WITHOUT "unauthorized" (see payloadAuth.js), so
// matching on these keywords is safe and keeps us from logging users out on a
// backend blip.
export const isAuthError = (error) => {
  const message =
    typeof error === "string" ? error : error?.message || "";
  const normalized = message.toLowerCase();
  return (
    normalized.includes("unauthorized") ||
    normalized.includes("invalid token") ||
    message === "Token has expired" ||
    normalized.includes("no token provided")
  );
};
