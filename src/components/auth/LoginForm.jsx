// LoginForm component.
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { BiLockAlt } from "react-icons/bi";
import { HiEye } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { authStorage, loginUser } from "../../services/authService";
function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const statusMessage = location.state?.statusMessage;
    if (!statusMessage) {
      return;
    }

    setStatus(statusMessage);
  }, [location.state]);

  const resolveRedirectPath = () => {
    const fromState = location.state?.from;
    const statePath = fromState?.pathname
      ? `${fromState.pathname}${fromState.search || ""}${fromState.hash || ""}`
      : "";

    if (statePath.startsWith("/") && !statePath.startsWith("//")) {
      return statePath;
    }

    const redirectParam =
      new URLSearchParams(location.search).get("redirect") || "";
    if (redirectParam.startsWith("/") && !redirectParam.startsWith("//")) {
      return redirectParam;
    }

    return "/dashboard";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setStatus("Email and password are required");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await loginUser({
        email: trimmedEmail,
        password,
      });

      if (response?.token) {
        authStorage.setToken(response.token);
        if (response?.data) {
          authStorage.setUser(response.data);
        }
        navigate(resolveRedirectPath(), { replace: true });
        return;
      }

      setStatus("Login succeeded, but no token was returned");
    } catch (error) {
      setStatus(error?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-8 sm:p-10 md:p-12"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight sm:text-3xl md:text-4xl">
          Login Your Account
        </h1>
        <p className="text-sm text-slate-600 sm:text-base md:text-lg">
          Sign In To Continue To Your Account
        </p>
      </div>
      {/* Email Address Field */}
      <div className="space-y-2 relative">
        <label
          htmlFor="email"
          className="block text-base font-medium text-slate-700"
        >
          Email Address<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <AiOutlineMail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            id="email"
            type="email"
            placeholder="Type your email address..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-slate-900 text-base"
          />
        </div>
      </div>

      {/* Password Field with visibility toggle */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-base font-medium text-slate-700"
        >
          Password<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <BiLockAlt
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="block w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-slate-900 text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <HiEye size={20} />
          </button>
        </div>
      </div>

      {/* Forget Password link */}
      <div className="text-right">
        <Link
          to="/auth/forgot-password"
          className="text-base font-medium text-slate-700 hover:text-slate-900 underline decoration-slate-400 decoration-1 underline-offset-4"
        >
          Forget Password?
        </Link>
      </div>

      {status ? <p className="text-sm text-amber-600">{status}</p> : null}

      {/* Large Yellow Login Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-amber-400 px-6 py-4 text-base font-bold text-white shadow transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg md:text-xl"
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>

      {/* 'or' Divider */}
      <div className="flex items-center gap-4 text-slate-400">
        <div className="h-px flex-1 bg-slate-200"></div>
        <p className="text-sm font-medium">or</p>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      {/* Social Logins */}
      <div className="space-y-5">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-base font-semibold text-slate-700 shadow-sm transition-colors"
        >
          <FcGoogle size={24} />
          Sign in with Google
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-base font-semibold text-slate-700 shadow-sm transition-colors"
        >
          <BsApple size={24} className="text-slate-900" />
          Sign in with Apple
        </button>
      </div>

      {/* Footer with signup link */}
      <div className="text-center text-sm text-slate-600 sm:text-base md:text-lg">
        <p className="space-x-1">
          <span>Don't have an account?</span>
          <Link
            to="/auth/signup"
            className="text-amber-400 font-semibold hover:text-amber-500 hover:underline"
          >
            Start free trial
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
