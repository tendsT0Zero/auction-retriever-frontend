// Hero component.
import React from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import HomeHeader from "../../shared/HomeHeader";
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <HomeHeader />

      <div className="flex flex-col lg:flex-row">
        <div className="mx-auto flex min-h-[640px] max-w-6xl flex-col gap-12 px-4 pt-24 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-5 pb-12 pt-2">
            <h1 className="max-w-md text-3xl font-extrabold leading-tight text-amber-400 sm:text-4xl lg:text-[40px]">
              Find Hidden Property
              <br />
              Auctions Before
              <br />
              Everyone Else
            </h1>

            <p className="max-w-md text-sm leading-7 text-zinc-600 sm:text-base">
              Auction Retriever scans multiple auction platforms and puts the
              best real estate deals into one simple dashboard so you can
              discover land and property auctions in seconds instead of hours.
            </p>

            <div className="mt-3 flex flex-col items-start gap-2">
              <Link
                to="/auth/signup"
                className="rounded-[8px] bg-amber-500 px-7 py-3 text-[13px] font-bold text-amber-800 shadow-lg hover:cursor-pointer"
              >
                Start 7-Day Free Trial
              </Link>
              <p className="text-[11px] text-zinc-500">
                No credit card required • Cancel anytime
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <FcGoogle size={28} />
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.6px] text-zinc-500">
                  Google Reviews
                </p>
                <div className="flex items-center gap-2 text-[11px] text-zinc-800">
                  <span className="font-bold text-zinc-900">4.9</span>
                  <span className="tracking-[1px] text-amber-400">★★★★★</span>
                  <span className="text-[11px] text-zinc-700">
                    1,358 reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 items-start justify-center lg:justify-end">
          <img
            className="mx-auto w-full max-w-sm object-contain sm:max-w-md lg:absolute lg:right-0 lg:top-0 lg:max-w-none"
            src="/illustration.png"
            alt="Modern building"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 bg-amber-50 px-4 py-7 sm:gap-10 sm:px-6 lg:gap-20">
        <div className="text-center">
          <p className="text-[19px] font-extrabold text-amber-500">25+</p>
          <p className="text-[11px] uppercase tracking-[0.4px] text-zinc-500">
            Years Experience
          </p>
        </div>
        <div className="text-center">
          <p className="text-[19px] font-extrabold text-amber-500">500+</p>
          <p className="text-[11px] uppercase tracking-[0.4px] text-zinc-500">
            Properties Managed
          </p>
        </div>
        <div className="text-center">
          <p className="text-[19px] font-extrabold text-amber-500">98%</p>
          <p className="text-[11px] uppercase tracking-[0.4px] text-zinc-500">
            Client Retention
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
