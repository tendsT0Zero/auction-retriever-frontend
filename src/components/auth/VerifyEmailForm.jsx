// VerifyEmailForm component.
import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authStorage } from "../../services/authService";
// OTP verification flow (postponed):
// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { authStorage, resendOtp, verifyOtp } from "../../services/authService";

function VerifyEmailForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingEmail = authStorage.getPendingEmail();
  const hasVerificationPayload = searchParams.toString().length > 0;
  const message =
    "Email verification link sent in your email, verify and login.";

  useEffect(() => {
    if (!hasVerificationPayload) {
      return;
    }

    authStorage.clearPendingEmail();
    navigate("/auth", {
      replace: true,
      state: {
        statusMessage: "Email verified successfully. Please login.",
      },
    });
  }, [hasVerificationPayload, navigate]);

  if (hasVerificationPayload) {
    return (
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-6 sm:p-10 md:p-12">
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight sm:text-3xl md:text-4xl">
          Verification complete
        </h1>
        <p className="text-sm text-slate-600 sm:text-base md:text-lg">
          Redirecting to login...
        </p>
      </div>
    );
  }

  // OTP verification :
  // const navigate = useNavigate();
  // const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  // const inputRefs = useRef([]);
  // const [status, setStatus] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const handleChange = (index, value) => {
  //   if (value && !/^\d$/.test(value)) {
  //     return;
  //   }
  //   const newOtp = [...otp];
  //   newOtp[index] = value;
  //   setOtp(newOtp);
  //   if (value && index < 5) {
  //     inputRefs.current[index + 1]?.focus();
  //   }
  // };
  // const handleKeyDown = (index, e) => {
  //   if (e.key === "Backspace") {
  //     e.preventDefault();
  //     const newOtp = [...otp];
  //     if (otp[index]) {
  //       newOtp[index] = "";
  //       setOtp(newOtp);
  //     } else if (index > 0) {
  //       newOtp[index - 1] = "";
  //       setOtp(newOtp);
  //       inputRefs.current[index - 1]?.focus();
  //     }
  //   } else if (e.key === "ArrowLeft" && index > 0) {
  //     inputRefs.current[index - 1]?.focus();
  //   } else if (e.key === "ArrowRight" && index < 5) {
  //     inputRefs.current[index + 1]?.focus();
  //   }
  // };
  // const handlePaste = (e) => {
  //   e.preventDefault();
  //   const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
  //   const newOtp = ["", "", "", "", "", ""];
  //   for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
  //     newOtp[i] = pastedData[i];
  //   }
  //   setOtp(newOtp);
  //   if (pastedData.length === 6) {
  //     inputRefs.current[5]?.blur();
  //   } else {
  //     inputRefs.current[pastedData.length]?.focus();
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const verificationCode = otp.join("");
  //   if (!pendingEmail) {
  //     setStatus("Missing email. Please sign up again.");
  //     return;
  //   }
  //   if (verificationCode.length < 6) {
  //     setStatus("Enter the 6-digit verification code");
  //     return;
  //   }
  //   setIsSubmitting(true);
  //   setStatus("");
  //   try {
  //     const response = await verifyOtp({
  //       email: pendingEmail,
  //       otp: verificationCode,
  //     });
  //     if (response?.token) {
  //       authStorage.setToken(response.token);
  //       if (response?.data) {
  //         authStorage.setUser(response.data);
  //       }
  //       authStorage.clearPendingEmail();
  //       navigate("/dashboard");
  //       return;
  //     }
  //     setStatus("Verification succeeded, please log in");
  //   } catch (error) {
  //     setStatus(error?.message || "Verification failed");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  // const handleResend = async () => {
  //   if (!pendingEmail) {
  //     setStatus("Missing email. Please sign up again.");
  //     return;
  //   }
  //   setIsSubmitting(true);
  //   setStatus("");
  //   try {
  //     await resendOtp({ email: pendingEmail });
  //     setOtp(["", "", "", "", "", ""]);
  //     inputRefs.current[0]?.focus();
  //     setStatus("A new code was sent to your email");
  //   } catch (error) {
  //     setStatus(error?.message || "Could not resend code");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-6 sm:p-10 md:p-12">
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight sm:text-3xl md:text-4xl">
          Verify Your Email
        </h1>
        <p className="text-sm text-slate-600 sm:text-base md:text-lg">
          {message}
        </p>
        {pendingEmail ? (
          <p className="text-xs text-slate-500 sm:text-sm">
            Sent to: {pendingEmail}
          </p>
        ) : null}
      </div>

      <p className="text-sm text-slate-600 sm:text-base">
        After verifying your email, you can log in to continue.
      </p>

      <Link
        to="/auth"
        className="inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-4 text-base font-bold text-white shadow transition-colors hover:bg-amber-500 sm:text-lg md:text-xl"
      >
        Go to Login
      </Link>

      {/* OTP UI */}
      {/*
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-8 sm:p-10 md:p-12"
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight sm:text-3xl md:text-4xl">
            Verify Your Email
          </h1>
          <p className="text-sm text-slate-600 sm:text-base md:text-lg">
            We've Sent A Verification Code To Your Email
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-10 w-10 rounded-lg border border-slate-300 bg-slate-50 text-center text-lg font-bold outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 sm:h-12 sm:w-12 sm:text-2xl"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-amber-400 px-6 py-4 text-base font-bold text-white shadow transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg md:text-xl"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>

        {status ? <p className="text-sm text-amber-600">{status}</p> : null}

        <div className="text-center">
          <p className="text-slate-600">
            Didn't receive code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-amber-400 font-semibold hover:text-amber-500 hover:underline"
              disabled={isSubmitting}
            >
              Resend Now
            </button>
          </p>
        </div>
      </form>
      */}
    </div>
  );
}

export default VerifyEmailForm;
