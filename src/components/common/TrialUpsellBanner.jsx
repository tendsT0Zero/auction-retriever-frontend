import React from "react";
import { Link } from "react-router-dom";

function TrialUpsellBanner({
  title = "Start your 7-days free trial",
  description = "Unlock full access to auction and saved listing tools by activating your trial.",
  className = "",
}) {
  return (
    <div
      className={`w-full rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white px-6 py-7 shadow-sm ${className}`}
    >
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
          <p className="mt-1 text-sm text-zinc-600">{description}</p>
        </div>

        <Link
          to="/checkout"
          className="inline-flex rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          Start your 7-days free trial
        </Link>
      </div>
    </div>
  );
}

export default TrialUpsellBanner;
