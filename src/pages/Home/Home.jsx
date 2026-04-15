// Home component.
import React, { useEffect, useState } from "react";
import Hero from "../../components/Home/Hero";
import Hero2 from "../../components/Home/Hero2";
import AuctionOpportunitySection from "../../components/Home/AuctionOpportunitySection";
import PropertySection from "../../components/Home/PropertySection";
import ProAccessPlanSection from "../../components/Home/ProAccessPlanSection";
import BenefitsSection from "../../components/Home/BenefitsSection";
import ReviewSection from "../../components/Home/ReviewSection";
import CTASection from "../../components/Home/CTASection";
import HomeFooter from "../../shared/HomeFooter";
import { authStorage } from "../../services/authService";
import { getSubscriptionPlans } from "../../services/subscriptionService";

const fallbackPlan = {
  planName: "Pro Access Plan",
  price: "$29.99",
  intervalUnit: "month",
  trialDays: 7,
  subtitle: "Billed monthly after 7-day free trial",
  features: [
    "Discover undervalued land and property auctions across multiple platforms",
    "Instantly search thousands of active auctions in one dashboard",
    "Filter deals by state, county, property type, and starting bid",
    "Track upcoming auction dates so you never miss an opportunity",
    "Save and organize interesting properties to review later",
    "Jump directly to the original auction listing with one click",
    "Receive a weekly digest of new auctions added to the platform",
    "Cancel anytime with no contracts or commitments",
  ],
};

const extractPlanData = (payload) => {
  const data = payload?.data ?? payload;

  if (Array.isArray(data)) {
    return data[0] || null;
  }

  if (Array.isArray(data?.data)) {
    return data.data[0] || null;
  }

  if (data && typeof data === "object") {
    return data;
  }

  return null;
};

const formatIntervalUnit = (interval) => {
  const value = typeof interval === "string" ? interval.toLowerCase() : "";
  if (["day", "week", "month", "year"].includes(value)) {
    return value;
  }
  return "month";
};

const formatIntervalText = (intervalUnit) => {
  const map = {
    day: "daily",
    week: "weekly",
    month: "monthly",
    year: "yearly",
  };
  return map[intervalUnit] || intervalUnit;
};

const formatTrialLabel = (trialDays) =>
  trialDays === 1 ? "1-day" : `${trialDays}-day`;

const formatPrice = (price, fallbackPrice) => {
  const amount = Number(price);
  if (!Number.isFinite(amount)) {
    return fallbackPrice;
  }
  return `$${amount.toFixed(2)}`;
};

const buildPlanForHome = (plan, fallback) => {
  if (!plan) return fallback;

  const intervalUnit = formatIntervalUnit(
    plan.interval || fallback.intervalUnit,
  );
  const trialDays = Number.isFinite(Number(plan.trial_days))
    ? Number(plan.trial_days)
    : fallback.trialDays;
  const subtitle =
    trialDays > 0
      ? `Billed ${formatIntervalText(intervalUnit)} after ${formatTrialLabel(
          trialDays,
        )} free trial`
      : `Billed ${formatIntervalText(intervalUnit)}`;

  return {
    planName: plan.name || fallback.planName,
    price: formatPrice(plan.price, fallback.price),
    intervalUnit,
    trialDays,
    subtitle,
    features:
      Array.isArray(plan.features) && plan.features.length > 0
        ? plan.features
        : fallback.features,
  };
};

const benefits = [
  {
    id: 1,
    icon: "../public/icons/clock-circle.png",
    title: "Save Hours Every Week",
    description:
      "Stop manually checking multiple auction sites. We do it for you automatically.",
  },
  {
    id: 2,
    icon: "../public/icons/Bell.png",
    title: "Never Miss an Opportunity",
    description: "Get notified of new listings as soon as they're available.",
  },
  {
    id: 3,
    icon: "../public/icons/Star.png",
    title: "Save Your Favourites",
    description:
      "Bookmark listings you're interested in and access them anytime.",
  },
  {
    id: 4,
    icon: "../public/icons/X-Circle.png",
    title: "Cancel Anytime",
    description:
      "No long-term contracts. Cancel your subscription with one click.",
  },
];

const testimonials = [
  {
    id: 1,
    role: "LAND INVESTOR",
    rating: 5,
    content:
      "Auction Retriever saves me hours every week. Instead of checking multiple auction sites manually, everything is already organized in one place.",
  },
  {
    id: 2,
    role: "REAL ESTATE INVESTOR",
    rating: 5,
    content:
      "I've already found several interesting land deals I never would have seen otherwise. The filtering tools make it incredibly easy to scan opportunities.",
  },
  {
    id: 3,
    role: "PROPERTY INVESTOR",
    rating: 5,
    content:
      "This is one of the most useful tools I've used for auction research. It helps me quickly find undervalued properties before the auction date.",
  },
];
function Home() {
  const [plan, setPlan] = useState(fallbackPlan);
  const isAuthenticated = Boolean(authStorage.getToken());

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = authStorage.getToken();
        const response = await getSubscriptionPlans(token);
        const planData = extractPlanData(response);

        if (planData) {
          setPlan(buildPlanForHome(planData, fallbackPlan));
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error.message);
      }
    };

    fetchPlan();
  }, []);

  return (
    <div>
      <Hero2 isAuthenticated={isAuthenticated} />
      <AuctionOpportunitySection />
      <PropertySection />
      <ProAccessPlanSection plan={plan} isAuthenticated={isAuthenticated} />
      <BenefitsSection benefits={benefits} />
      <ReviewSection testimonials={testimonials} />
      <CTASection isAuthenticated={isAuthenticated} />
      <HomeFooter />
    </div>
  );
}

export default Home;
