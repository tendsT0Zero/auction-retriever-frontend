const ACTIVE_STATUSES = new Set([
  "active",
  "trialing",
  "trial",
  "in_trial",
  "on_trial",
  "subscribed",
  "paid",
  "grace_period",
]);

const resolveStatusFromPayload = (payload) => {
  const data = payload?.data ?? payload;

  if (!data || typeof data !== "object") {
    return "";
  }

  const statusCandidates = [
    data.status,
    data.subscription_status,
    data.subscription?.status,
    data.subscription?.subscription_status,
  ];

  const rawStatus = statusCandidates.find(
    (value) => typeof value === "string" && value.trim().length > 0,
  );

  if (!rawStatus) {
    return "";
  }

  return rawStatus.trim().toLowerCase().replace(/\s+/g, "_");
};

const resolveBooleanAccess = (payload) => {
  const data = payload?.data ?? payload;

  if (!data || typeof data !== "object") {
    return null;
  }

  const boolCandidates = [
    data.active,
    data.is_active,
    data.subscription_active,
    data.subscription?.active,
    data.subscription?.is_active,
  ];

  const resolved = boolCandidates.find((value) => typeof value === "boolean");
  return resolved ?? null;
};

export function isActiveSubscriptionStatus(status) {
  if (!status || typeof status !== "string") {
    return false;
  }

  const normalized = status.trim().toLowerCase().replace(/\s+/g, "_");
  return ACTIVE_STATUSES.has(normalized);
}

export function extractSubscriptionAccess(payload) {
  const status = resolveStatusFromPayload(payload);
  const boolAccess = resolveBooleanAccess(payload);

  const isActive =
    typeof boolAccess === "boolean"
      ? boolAccess
      : isActiveSubscriptionStatus(status);

  return {
    status,
    isActive,
  };
}
