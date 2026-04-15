// ResetPasswordForm component.
import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { resetPassword } from "../../services/authService";

const stripWrappingQuotes = (value) =>
  String(value || "")
    .trim()
    .replace(/^['\"]|['\"]$/g, "");

const extractRawTokenFromSearch = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const search = window.location.search || "";
  const tokenMatch = search.match(
    /[?&](?:token|reset_token|otp_token)=([^&#]*)/i,
  );

  if (!tokenMatch?.[1]) {
    return "";
  }

  try {
    return decodeURIComponent(tokenMatch[1]);
  } catch {
    return tokenMatch[1];
  }
};

const buildTokenCandidates = (value) => {
  const seed = stripWrappingQuotes(value);
  if (!seed) {
    return [];
  }

  const candidateSet = new Set([seed]);
  candidateSet.add(seed.replace(/\s+/g, "+"));

  try {
    const decoded = stripWrappingQuotes(decodeURIComponent(seed));
    if (decoded) {
      candidateSet.add(decoded);
      candidateSet.add(decoded.replace(/\s+/g, "+"));
    }
  } catch {
    // Ignore malformed URI sequences and continue with known candidates.
  }

  return Array.from(candidateSet).filter(Boolean);
};

const getBackendErrorMessage = (error) => {
  const fieldErrors = Array.isArray(error?.payload?.errors)
    ? error.payload.errors
    : [];

  if (fieldErrors.length > 0) {
    return fieldErrors
      .map((item) => item?.message)
      .filter(Boolean)
      .join(" ");
  }

  return error?.message || "Failed to reset password";
};

function ResetPasswordForm() {
  const navigate = useNavigate();
  const { token: tokenFromPath } = useParams();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resolvedToken, setResolvedToken] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const rawQueryToken = extractRawTokenFromSearch();
    const queryToken =
      tokenFromPath ||
      rawQueryToken ||
      searchParams.get("token") ||
      searchParams.get("reset_token") ||
      searchParams.get("otp_token") ||
      "";

    setResolvedToken(stripWrappingQuotes(queryToken));
  }, [searchParams, tokenFromPath]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tokenCandidates = buildTokenCandidates(resolvedToken);

    if (!tokenCandidates.length) {
      setStatus("Reset link is invalid or expired. Please request a new one.");
      return;
    }

    if (password.length < 8) {
      setStatus("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      let response = null;

      for (let index = 0; index < tokenCandidates.length; index += 1) {
        const tokenCandidate = tokenCandidates[index];

        try {
          response = await resetPassword({
            password,
            passwordConfirmation: confirmPassword,
            token: tokenCandidate,
          });
          break;
        } catch (error) {
          const tokenFieldError = Array.isArray(error?.payload?.errors)
            ? error.payload.errors.find(
                (item) => String(item?.field || "").toLowerCase() === "token",
              )
            : null;
          const shouldTryNextToken =
            error?.status === 422 &&
            tokenFieldError &&
            index < tokenCandidates.length - 1;

          if (!shouldTryNextToken) {
            throw error;
          }
        }
      }

      if (!response) {
        setStatus(
          "Reset link is invalid or expired. Please request a new one.",
        );
        return;
      }

      const successMessage =
        response?.message || "Password updated successfully";
      setStatus(successMessage);
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/auth", {
          replace: true,
          state: {
            statusMessage: successMessage,
          },
        });
      }, 1200);
    } catch (error) {
      setStatus(getBackendErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-6 sm:p-10 md:p-12"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight sm:text-3xl">
          Reset Password
        </h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Create a new password for your account.
        </p>
      </div>

      {!resolvedToken ? (
        <p className="text-sm text-red-600">
          Reset link is invalid or expired. Please request a new one.
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="block text-base font-medium text-slate-700">
          New Password<span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter new password..."
          disabled={isSubmitting}
          className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-slate-900 text-base disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-base font-medium text-slate-700">
          Confirm Password<span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm new password..."
          disabled={isSubmitting}
          className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-slate-900 text-base disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      {status ? <p className="text-sm text-amber-600">{status}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting || !resolvedToken}
        className="w-full rounded-xl bg-amber-400 px-6 py-4 text-base font-bold text-white shadow transition-colors hover:bg-amber-500 sm:text-lg disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Updating..." : "Update Password"}
      </button>

      <div className="text-center text-xs text-slate-600 sm:text-sm">
        Back to{" "}
        <Link
          to="/auth"
          className="text-amber-400 font-semibold hover:underline"
        >
          Log in
        </Link>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
