// CTASection component.
import React from "react";
import { Link } from "react-router-dom";

function CTASection({ isAuthenticated = false }) {
  const title = isAuthenticated
    ? "Continue Finding Property Auctions"
    : "Start Finding Property Auctions Today";
  const description = isAuthenticated
    ? "Open your dashboard to review saved listings and new auctions."
    : "Join Auction Retriever and discover thousands of land and property auctions in one simple dashboard. Start your 7 day free trial and cancel anytime.";
  const ctaLabel = isAuthenticated ? "Go to Dashboard" : "Get Started";
  const ctaLink = isAuthenticated ? "/dashboard" : "/auth/signup";

  return (
    <div className="bg-amber-400 flex flex-col gap-3 items-center justify-center px-4 py-10 sm:px-6">
      <h1 className="w-full max-w-xl mt-10 text-2xl text-zinc-800 font-bold text-center sm:mt-12 sm:text-3xl">
        {title}
      </h1>
      <p className="w-full max-w-2xl text-zinc-700 text-center text-sm sm:text-[14px]">
        {description}
      </p>
      <Link
        to={ctaLink}
        className="mb-10 rounded-md bg-zinc-800 px-10 py-2 text-sm text-amber-400 hover:bg-zinc-600 sm:mb-12"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

export default CTASection;
