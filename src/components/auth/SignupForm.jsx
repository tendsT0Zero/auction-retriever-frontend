// SignupForm component.
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { HiEye } from "react-icons/hi";
import { authStorage, registerUser } from "../../services/authService";

function SignupForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setStatus("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
        passwordConfirmation: confirmPassword,
      });
      authStorage.setPendingEmail(trimmedEmail);
      setStatus("Verification Link sent to your email");
      navigate("/auth/verify-email");
    } catch (error) {
      setStatus(error?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-6 sm:p-10 md:p-12"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight sm:text-3xl md:text-4xl">
          Start Your Free Trial
        </h1>
        <p className="text-sm text-slate-600 sm:text-base md:text-lg">
          7 Days Free, Then $10/Month. Cancel Anytime.
        </p>
      </div>

      <div className="space-y-6">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="fullname"
            className="block text-base font-medium text-slate-700"
          >
            Full Name<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MdOutlinePerson
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              id="fullname"
              type="text"
              placeholder="Type your name..."
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-slate-900 text-base"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-base font-medium text-slate-700"
          >
            Email Address<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MdOutlineEmail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              id="email"
              type="email"
              placeholder="Type your email address..."
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-slate-900 text-base"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-base font-medium text-slate-700"
          >
            Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <TbLockPassword
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Type your password..."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="block w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-slate-900 text-base"
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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="confirmpassword"
            className="block text-base font-medium text-slate-700"
          >
            Confirm Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <TbLockPassword
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              id="confirmpassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password..."
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="block w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-slate-900 text-base"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <HiEye size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Password Requirements */}
      <p className="text-sm text-slate-600">
        Use at least 8 characters with a mix of letters & numbers
      </p>

      {status ? <p className="text-sm text-amber-600">{status}</p> : null}

      {/* Create Account Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-amber-400 px-6 py-4 text-base font-bold text-white shadow transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg md:text-xl"
      >
        {isSubmitting ? "Creating..." : "Create Account"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 text-slate-400">
        <div className="h-px flex-1 bg-slate-200"></div>
        <p className="text-sm font-medium">or</p>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      {/* Login Link */}
      <div className="text-center text-sm text-slate-600 sm:text-base md:text-lg">
        <p>
          Already have an account?{" "}
          <Link
            to="/auth"
            className="text-amber-400 font-semibold hover:text-amber-500 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}
export default SignupForm;
