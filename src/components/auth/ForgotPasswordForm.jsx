// ForgotPasswordForm component.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgetPassword } from "../../services/authService";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus("Enter your email to continue");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await forgetPassword({
        email: trimmedEmail,
      });

      if (response?.status || response?.success) {
        setStatus(
          response?.message ||
            "A verification link send to your email. Please Check Your Email.",
        );
        return;
      }

      setStatus(response?.message || "Unable to send verification link");
    } catch (error) {
      setStatus(error?.message || "Unable to send verification link");
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
          Forgot Password
        </h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Enter your email to receive a reset link.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-base font-medium text-slate-700">
          Email Address<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Type your email address..."
          disabled={isSubmitting}
          className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-slate-900 text-base disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      {status ? <p className="text-sm text-amber-600">{status}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-amber-400 px-6 py-4 text-base font-bold text-white shadow transition-colors hover:bg-amber-500 sm:text-lg disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </button>

      <div className="text-center text-xs text-slate-600 sm:text-sm">
        Remember your password?{" "}
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

export default ForgotPasswordForm;
