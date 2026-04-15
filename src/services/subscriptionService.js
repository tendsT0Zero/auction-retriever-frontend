import { apiRequest } from "./apiClient";

export async function getSubscriptionPlans(token) {
  return apiRequest("/subscription/plans", {
    method: "GET",
    token,
  });
}

export async function getSubscriptionStatus(token) {
  return apiRequest("/auth/subscription/status", {
    method: "GET",
    token,
  });
}

export async function cancelSubscription(token) {
  return apiRequest("/auth/subscription/cancel", {
    method: "POST",
    token,
  });
}

export async function createSubscriptionSetupIntent(
  token,
  { planId, paymentMethod = "stripe" } = {},
) {
  const body = new FormData();

  if (planId !== undefined && planId !== null && `${planId}`.trim() !== "") {
    body.append("plan_id", String(planId));
  }

  if (paymentMethod) {
    body.append("payment_method", paymentMethod);
  }

  return apiRequest("/auth/subscription/setup-intent", {
    method: "POST",
    token,
    body,
  });
}

export async function createSubscription(
  token,
  { planId, paymentMethod } = {},
) {
  const body = new FormData();

  if (planId !== undefined && planId !== null && `${planId}`.trim() !== "") {
    body.append("plan_id", String(planId));
  }

  if (paymentMethod) {
    body.append("payment_method", paymentMethod);
  }

  return apiRequest("/auth/subscription/create", {
    method: "POST",
    token,
    body,
  });
}
