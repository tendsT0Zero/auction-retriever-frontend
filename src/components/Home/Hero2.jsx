// Hero2 component.
import React from "react";
import HomeHeader from "../../shared/HomeHeader";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function Hero2({ isAuthenticated = false }) {
  const ctaLabel = isAuthenticated
    ? "Go to Dashboard"
    : "Start 7-Days Free Trial";
  const ctaLink = isAuthenticated ? "/dashboard" : "/auth/signup";
  return (
    <div className="relative w-full min-h-[640px] overflow-hidden sm:min-h-[700px] mt-5 md:mt-0">
      {/* Hero Header */}
      <HomeHeader />

      {/* Hero image */}

      <img
        src="../public/illustration.png"
        alt="Modern building"
        className="absolute right-0 top-0 hidden h-full w-auto object-cover md:block"
      />

      {/* Hero content */}
      <div className="container mx-auto px-4 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-col items-start gap-5 pb-12 pt-2">
          <h1 className="w-full max-w-md text-2xl font-extrabold text-amber-900 sm:text-3xl lg:text-4xl">
            Find Hidden Property Auctions Before Everyone Else
          </h1>

          <p className="mt-4 w-full max-w-md text-sm text-zinc-600 sm:text-base">
            Auction Retriever scans multiple auction platforms and puts the best
            real estate deals into one simple dashboard so you can discover land
            and property auctions in seconds instead of hours.
          </p>

          <Link
            to={ctaLink}
            className="rounded-md bg-amber-500 px-6 py-3 text-sm text-white transition-colors hover:bg-amber-600 sm:text-base"
          >
            {ctaLabel}
          </Link>
          {!isAuthenticated ? (
            <p className="text-xs text-zinc-500">
              No credit card required • Cancel anytime
            </p>
          ) : null}

          {/* google review */}
          <div className="flex flex-row gap-2 sm:flex-row">
            {/* google icon */}
            <FcGoogle size={45} />
            {/* google review text */}
            <div className="flex flex-col items-start gap-1">
              <p className="text-[15px]">Google Reviews</p>
              <span className="text-[14px]">5 ⭐⭐⭐⭐⭐ 1,358 reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full bg-amber-100 py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl text-amber-400 font-bold">25+</h1>
              <p className="text-sm text-zinc-500">Years Experience</p>
            </div>

            <div>
              <h1 className="text-2xl text-amber-400 font-bold">500+</h1>
              <p className="text-sm text-zinc-500">Properties Managed</p>
            </div>
            <div>
              <h1 className="text-2xl text-amber-400 font-bold">98%</h1>
              <p className="text-sm text-zinc-500">Client Retention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero2;
