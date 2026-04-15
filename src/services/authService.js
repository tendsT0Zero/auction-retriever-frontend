import { apiRequest } from "./apiClient";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const PENDING_EMAIL_KEY = "pending_email";
export const AUTH_USER_UPDATED_EVENT = "auth:user-updated";

const emitUserUpdated = (user) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_USER_UPDATED_EVENT, {
      detail: user || null,
    }),
  );
};

export const authStorage = {
  getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    const normalizedToken = String(token || "").trim();

    if (
      !normalizedToken ||
      normalizedToken === "null" ||
      normalizedToken === "undefined"
    ) {
      localStorage.removeItem(TOKEN_KEY);
      return "";
    }

    return normalizedToken;
  },
  setToken(token) {
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user) {
    if (!user) return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    emitUserUpdated(user);
  },
  clearUser() {
    localStorage.removeItem(USER_KEY);
    emitUserUpdated(null);
  },
  updateUser(partialUser) {
    if (!partialUser || typeof partialUser !== "object") return null;
    const currentUser = this.getUser() || {};
    const nextUser = {
      ...currentUser,
      ...partialUser,
    };
    this.setUser(nextUser);
    return nextUser;
  },
  getPendingEmail() {
    return localStorage.getItem(PENDING_EMAIL_KEY) || "";
  },
  setPendingEmail(email) {
    if (!email) return;
    localStorage.setItem(PENDING_EMAIL_KEY, email);
  },
  clearPendingEmail() {
    localStorage.removeItem(PENDING_EMAIL_KEY);
  },
};

export async function registerUser({
  name,
  email,
  password,
  passwordConfirmation,
}) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("password_confirmation", passwordConfirmation);
  return apiRequest("/register", { method: "POST", body: formData });
}

export async function loginUser({ email, password }) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  return apiRequest("/login", { method: "POST", body: formData });
}

export async function verifyOtp({ email, otp }) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("otp", otp);
  return apiRequest("/verify-otp", { method: "POST", body: formData });
}

export async function resendOtp({ email }) {
  const formData = new FormData();
  formData.append("email", email);
  return apiRequest("/resend-otp", { method: "POST", body: formData });
}

export async function forgetPassword({ email }) {
  const formData = new FormData();
  formData.append("email", email);
  return apiRequest("/forget-password", { method: "POST", body: formData });
}

export async function resetPassword({ password, passwordConfirmation, token }) {
  const formData = new FormData();
  formData.append("password", password);
  formData.append("password_confirmation", passwordConfirmation);
  formData.append("token", token);

  return apiRequest("/reset-password", { method: "POST", body: formData });
}
