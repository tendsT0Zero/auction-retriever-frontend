const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/saved-listings",
  "/accounts",
  "/checkout",
];

const isProtectedRoute = (pathname) =>
  PROTECTED_ROUTE_PREFIXES.some((route) => pathname.startsWith(route));

const redirectToAuth = () => {
  if (typeof window === "undefined") {
    return;
  }

  const { pathname, search, hash } = window.location;
  if (!isProtectedRoute(pathname)) {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);

  const redirectPath = `${pathname}${search}${hash}`;
  window.location.replace(`/auth?redirect=${encodeURIComponent(redirectPath)}`);
};

const buildUrl = (path) => {
  if (!path) return API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_BASE_URL.replace(/\/$/, "");
  const next = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${next}` : next;
};

export async function apiRequest(path, options = {}) {
  const { method = "GET", headers: customHeaders = {}, body, token } = options;

  const headers = {
    Accept: "application/json",
    ...customHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = {
    method,
    headers,
  };

  if (body) {
    if (body instanceof FormData) {
      fetchOptions.body = body;
    } else {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
      fetchOptions.body = JSON.stringify(body);
    }
  }

  const response = await fetch(buildUrl(path), fetchOptions);
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    if (token && (response.status === 401 || response.status === 403)) {
      redirectToAuth();
    }

    const message =
      payload?.message ||
      payload?.error ||
      payload ||
      `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
