// ProAccessPlanSection component.
import React from "react";
import { Link } from "react-router-dom";

const formatIntervalLabel = (intervalUnit) => {
  const map = {
    day: "daily",
    week: "weekly",
    month: "monthly",
    year: "yearly",
  };
  return map[intervalUnit] || intervalUnit;
};

function ProAccessPlanSection({ plan, isAuthenticated = false }) {
  const intervalUnit = plan?.intervalUnit || "month";
  const trialDays = Number.isFinite(Number(plan?.trialDays))
    ? Number(plan.trialDays)
    : 0;
  const trialLabel = trialDays === 1 ? "1-day" : `${trialDays}-day`;
  const features = Array.isArray(plan?.features) ? plan.features : [];
  const subtitle = plan?.subtitle || "Billed monthly";
  const showTrial = !isAuthenticated && trialDays > 0;
  const displaySubtitle = isAuthenticated
    ? `Billed ${formatIntervalLabel(intervalUnit)}`
    : subtitle;
  const actionLabel = isAuthenticated ? "Continue to Checkout" : "Get Started";
  const actionLink = isAuthenticated ? "/checkout" : "/auth/signup";

  return (
    <div className="bg-amber-100 flex flex-col justify-center items-center py-12 gap-4 px-4 sm:px-6">
      <h1 className="text-center text-xl font-bold text-zinc-800 sm:text-2xl">
        Auction Retriever
      </h1>
      <p className="mt-3 text-center text-sm text-zinc-600 sm:text-[14px]">
        Access aggregated real estate and land auction listings
      </p>

      <div className="relative w-full max-w-xl rounded-md bg-white p-4 sm:p-6">
        {showTrial ? (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-950 px-6 py-1 text-[10px] text-white">
            {trialLabel} free trial
          </span>
        ) : null}
        <h2 className="mt-4 text-center text-xl text-zinc-600 sm:text-2xl">
          {plan?.planName || "Plan"}
        </h2>
        <h1 className="mt-3 text-center text-base text-zinc-400 sm:text-lg">
          <span className="text-3xl font-bold text-amber-500">
            {plan?.price || "$0.00"}
          </span>
          /{intervalUnit}
        </h1>
        <p className="mb-4 mt-3 text-center text-sm text-zinc-400 sm:text-[16px]">
          {displaySubtitle}
        </p>
        {features.map((feature, index) => (
          <p
            key={index}
            className="m-1 px-2 text-sm text-zinc-600 sm:px-4 sm:text-base"
          >
            <span className="mr-2 inline-flex rounded-full border border-amber-400 p-0.5 text-[10px] text-amber-400">
              ✔️
            </span>
            {feature}
          </p>
        ))}

        <Link
          to={actionLink}
          className="mx-auto mt-6 block w-full max-w-md rounded-md bg-amber-400 py-2 text-center text-sm font-semibold text-zinc-900"
        >
          {actionLabel}
        </Link>
        <p className="mt-4 block text-center text-sm text-zinc-500 sm:mt-6 sm:text-[14px]">
          {showTrial
            ? `${trialLabel} free trial • Cancel Anytime`
            : "Cancel Anytime"}
        </p>
      </div>
    </div>
  );
}

export default ProAccessPlanSection;
