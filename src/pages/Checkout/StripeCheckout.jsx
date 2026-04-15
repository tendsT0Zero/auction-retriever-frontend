import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { authStorage } from "../../services/authService";
import {
  createSubscription,
  createSubscriptionSetupIntent,
  getSubscriptionPlans,
} from "../../services/subscriptionService";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const stripeElementStyle = {
  style: {
    base: {
      color: "#4b5563",
      fontSize: "14px",
      fontFamily: "Arial, sans-serif",
      lineHeight: "20px",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#dc2626",
      iconColor: "#dc2626",
    },
  },
};

const extractPlanList = (payload) => {
  const data = payload?.data ?? payload;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (data && typeof data === "object") {
    return [data];
  }

  return [];
};

const pickCheckoutPlan = (plans) => {
  if (!Array.isArray(plans) || plans.length === 0) {
    return null;
  }

  return plans[0];
};

const resolvePlanId = (plan) => {
  if (!plan || typeof plan !== "object") {
    return null;
  }

  const candidates = [plan.id, plan.plan_id, plan.planId];
  const found = candidates.find((value) =>
    ["string", "number"].includes(typeof value),
  );

  return found ?? null;
};

const resolveIntervalUnit = (interval) => {
  const value = typeof interval === "string" ? interval.toLowerCase() : "";
  if (["day", "week", "month", "year"].includes(value)) {
    return value;
  }
  return "month";
};

const formatIntervalLabel = (intervalUnit) => {
  const labels = {
    day: "daily",
    week: "weekly",
    month: "monthly",
    year: "yearly",
  };

  return labels[intervalUnit] || intervalUnit;
};

const resolveTrialDays = (trialDays) => {
  const value = Number(trialDays);
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }
  return Math.floor(value);
};

const resolvePlanFeatures = (plan) => {
  if (!plan) {
    return [];
  }

  if (Array.isArray(plan.features)) {
    return plan.features
      .map((feature) => String(feature || "").trim())
      .filter(Boolean);
  }

  if (typeof plan.features === "string") {
    return plan.features
      .split("\n")
      .map((feature) => feature.trim())
      .filter(Boolean);
  }

  return [];
};

const resolveSetupIntentSecret = (payload) => {
  const data = payload?.data ?? payload;

  if (!data || typeof data !== "object") {
    return "";
  }

  const candidates = [
    data.client_secret,
    data.clientSecret,
    data.setup_intent_client_secret,
    data.setupIntentClientSecret,
    data.setup_intent?.client_secret,
    data.setupIntent?.client_secret,
    data.intent?.client_secret,
  ];

  return (
    candidates.find(
      (candidate) =>
        typeof candidate === "string" && candidate.trim().length > 0,
    ) || ""
  );
};

const resolvePaymentMethodFromSetupIntent = (setupIntent) => {
  const paymentMethod = setupIntent?.payment_method;
  if (typeof paymentMethod === "string") {
    return paymentMethod;
  }
  if (paymentMethod && typeof paymentMethod === "object") {
    return paymentMethod.id || "";
  }
  return "";
};

const formatPrice = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return "--";
  }
  return `$${amount.toFixed(2)}`;
};

function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [setupIntentSecret, setSetupIntentSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    cardholderName: "",
    country: "Nigeria",
    addressLine1: "",
    addressLine2: "",
    suburb: "",
    city: "",
    postalCode: "",
    state: "",
  });

  const priceLabel = formatPrice(plan?.price);
  const intervalUnit = resolveIntervalUnit(plan?.interval);
  const planName = plan?.name || "Plan";
  const trialDays = resolveTrialDays(plan?.trial_days);
  const recurringLabel = `Billed ${formatIntervalLabel(intervalUnit)}`;
  const periodLabel = `Per ${intervalUnit}`;
  const totalDueToday = trialDays > 0 ? "$0.00" : priceLabel;
  const subtotalLabel =
    trialDays > 0
      ? `${priceLabel} (after ${trialDays}-day trial)`
      : `${priceLabel} (starts today)`;
  const planFeatures = resolvePlanFeatures(plan);

  useEffect(() => {
    let ignore = false;

    const token = authStorage.getToken();
    const savedUser = authStorage.getUser();

    if (savedUser?.email) {
      setFormValues((prev) => ({
        ...prev,
        email: savedUser.email,
      }));
    }

    if (!token) {
      setErrorMessage("Please login first to continue checkout.");
      setIsLoading(false);
      return () => {
        ignore = true;
      };
    }

    const loadCheckoutData = async () => {
      try {
        const planResponse = await getSubscriptionPlans(token);
        const planList = extractPlanList(planResponse);
        const fetchedPlan = pickCheckoutPlan(planList);

        if (!fetchedPlan) {
          throw new Error("No subscription plan found.");
        }

        const selectedPlanId = resolvePlanId(fetchedPlan);

        if (!selectedPlanId) {
          throw new Error("Invalid plan configuration.");
        }

        if (!ignore) {
          setPlan(fetchedPlan);
        }

        try {
          const setupIntentResponse = await createSubscriptionSetupIntent(
            token,
            {
              planId: selectedPlanId,
              paymentMethod: "stripe",
            },
          );

          if (!ignore) {
            setSetupIntentSecret(resolveSetupIntentSecret(setupIntentResponse));
          }
        } catch {
          if (!ignore) {
            setSetupIntentSecret("");
          }
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || "Unable to load subscription plan.");
          setPlan(null);
          setSetupIntentSecret("");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadCheckoutData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleInputChange = (field) => (event) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const token = authStorage.getToken();

    if (!token) {
      setErrorMessage("Please login first to continue checkout.");
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage("Stripe is still loading, please try again.");
      return;
    }

    if (!formValues.cardholderName.trim()) {
      setErrorMessage("Cardholder name is required.");
      return;
    }

    const planId = resolvePlanId(plan);

    if (!planId) {
      setErrorMessage("Subscription plan is unavailable.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setErrorMessage("Card form is not ready yet.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { paymentMethod, error: paymentMethodError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            name: formValues.cardholderName,
            email: formValues.email,
            address: {
              country: formValues.country,
              line1: formValues.addressLine1,
              line2: formValues.addressLine2,
              city: formValues.city,
              state: formValues.state,
              postal_code: formValues.postalCode,
            },
          },
        });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message || "Invalid card details.");
      }

      let paymentMethodId = paymentMethod?.id;

      if (!paymentMethodId) {
        throw new Error("Payment method was not created.");
      }

      if (setupIntentSecret) {
        const setupIntentResult = await stripe.confirmCardSetup(
          setupIntentSecret,
          {
            payment_method: paymentMethodId,
          },
        );

        if (setupIntentResult.error) {
          throw new Error(
            setupIntentResult.error.message || "Card authorization failed.",
          );
        }

        const setupIntentPaymentMethod = resolvePaymentMethodFromSetupIntent(
          setupIntentResult.setupIntent,
        );

        if (setupIntentPaymentMethod) {
          paymentMethodId = setupIntentPaymentMethod;
        }
      }

      const response = await createSubscription(token, {
        planId,
        paymentMethod: paymentMethodId,
      });

      setSuccessMessage(
        response?.message || "Subscription created successfully.",
      );
      setTimeout(() => {
        navigate("/accounts");
      }, 1300);
    } catch (error) {
      setErrorMessage(error.message || "Unable to process payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const subscribeButtonLabel = isSubmitting ? "Processing..." : "Subscribe";

  return (
    <div className="min-h-screen bg-[#ebebeb] py-2">
      <div className="container mx-auto px-2">
        <div className="overflow-hidden border border-[#dadada] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.07)]">
          <div className="bg-[#4e4e4e] px-3 py-1 text-xs text-white">
            Stripe checkout
          </div>

          <div className="min-h-[calc(100vh-32px)] lg:flex">
            <section className="bg-[#5a9df2] px-7 pb-10 pt-8 text-white lg:w-[49%] lg:px-14 lg:pt-14">
              <div className="mx-auto max-w-75">
                <div className="mb-5 flex items-center gap-3">
                  <Link
                    to="/accounts"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15"
                    aria-label="Go back"
                  >
                    <FiArrowLeft size={16} />
                  </Link>
                  <Link to="/" aria-label="Go to home">
                    <img
                      src="/app-logo-auction-retriver.png"
                      alt="Auction Retriever"
                      className="h-10 w-auto object-contain sm:h-12"
                    />
                  </Link>
                </div>

                <p className="text-[29px] leading-none font-semibold">
                  Subscription fee
                </p>
                <div className="mt-2 flex items-start gap-2">
                  <p className="text-5xl font-semibold tracking-tight">
                    {priceLabel}
                  </p>
                  <span className="mt-3 text-base text-white/85">
                    {periodLabel}
                  </span>
                </div>

                <div className="mt-12 space-y-6 text-sm text-white/90">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{planName}</p>
                      <p className="text-white/70">{recurringLabel}</p>
                    </div>
                    <p className="font-semibold">{priceLabel}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">Duration</p>
                    <p className="font-semibold text-white">1 {intervalUnit}</p>
                  </div>

                  <div className="h-px bg-white/35" />

                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">Subtotal</p>
                    <p className="font-semibold text-white">{subtotalLabel}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">Tax</p>
                    <p className="font-semibold text-white/70">$0.00</p>
                  </div>

                  <div className="h-px bg-white/35" />

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-white">
                      Total due today
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {totalDueToday}
                    </p>
                  </div>
                </div>

                {planFeatures.length > 0 ? (
                  <div className="mt-8 rounded-md bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                      Plan features
                    </p>
                    <ul className="mt-3 space-y-2 text-xs text-white/90">
                      {planFeatures.map((feature, index) => (
                        <li key={`${feature}-${index}`} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="bg-[#f3f3f3] px-7 py-9 lg:w-[51%] lg:px-14 lg:py-14">
              <form className="mx-auto w-full max-w-95" onSubmit={handleSubmit}>
                <div className="space-y-7">
                  <div>
                    <h2 className="text-[29px] font-semibold text-[#3d3d3d]">
                      Contact information
                    </h2>
                    <div className="mt-3 overflow-hidden rounded-md border border-[#d9d9d9] bg-[#efefef]">
                      <div className="grid grid-cols-[74px_1fr] text-sm">
                        <span className="border-r border-[#d9d9d9] px-3 py-2 text-[#4d4d4d]">
                          Email
                        </span>
                        <input
                          type="email"
                          value={formValues.email}
                          onChange={handleInputChange("email")}
                          placeholder="info@gmail.com"
                          className="w-full bg-transparent px-3 py-2 text-[#4d4d4d] outline-none placeholder:text-[#9a9a9a]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-[29px] font-semibold text-[#3d3d3d]">
                      Payment method
                    </h2>

                    <label className="mt-3 mb-2 block text-sm font-medium text-[#565656]">
                      Card information
                    </label>
                    <div className="overflow-hidden rounded-md border border-[#d9d9d9] bg-white">
                      <div className="grid grid-cols-[1fr_auto] items-center px-3 py-3">
                        <CardNumberElement
                          options={{
                            ...stripeElementStyle,
                            placeholder: "Enter text",
                            showIcon: true,
                          }}
                        />
                        <div className="flex items-center gap-1 text-[10px] text-[#6f6f6f]">
                          <span className="rounded border border-[#d7d7d7] px-1 py-0.5">
                            MC
                          </span>
                          <span className="rounded border border-[#d7d7d7] px-1 py-0.5">
                            VISA
                          </span>
                          <span className="rounded border border-[#d7d7d7] px-1 py-0.5">
                            AMEX
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 border-t border-[#d9d9d9]">
                        <div className="px-3 py-3">
                          <CardExpiryElement
                            options={{
                              ...stripeElementStyle,
                              placeholder: "MM / YY",
                            }}
                          />
                        </div>
                        <div className="border-l border-[#d9d9d9] px-3 py-3">
                          <CardCvcElement
                            options={{
                              ...stripeElementStyle,
                              placeholder: "CVC",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <label className="mt-3 mb-2 block text-sm font-medium text-[#565656]">
                      Cardholder name
                    </label>
                    <input
                      value={formValues.cardholderName}
                      onChange={handleInputChange("cardholderName")}
                      type="text"
                      placeholder="Full name on card"
                      className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 text-[#4d4d4d] outline-none placeholder:text-[#9a9a9a]"
                    />

                    <label className="mt-3 mb-2 block text-sm font-medium text-[#565656]">
                      Country or region
                    </label>
                    <div className="overflow-hidden rounded-md border border-[#d9d9d9] bg-white">
                      <select
                        value={formValues.country}
                        onChange={handleInputChange("country")}
                        className="w-full border-b border-[#d9d9d9] px-3 py-2 text-[#4d4d4d] outline-none"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                      </select>

                      <input
                        value={formValues.addressLine1}
                        onChange={handleInputChange("addressLine1")}
                        type="text"
                        placeholder="Address line 1"
                        className="w-full border-b border-[#d9d9d9] px-3 py-2 text-[#4d4d4d] outline-none placeholder:text-[#9a9a9a]"
                      />

                      <input
                        value={formValues.addressLine2}
                        onChange={handleInputChange("addressLine2")}
                        type="text"
                        placeholder="Address line 2"
                        className="w-full border-b border-[#d9d9d9] px-3 py-2 text-[#4d4d4d] outline-none placeholder:text-[#9a9a9a]"
                      />

                      <input
                        value={formValues.suburb}
                        onChange={handleInputChange("suburb")}
                        type="text"
                        placeholder="Suburb"
                        className="w-full border-b border-[#d9d9d9] px-3 py-2 text-[#4d4d4d] outline-none placeholder:text-[#9a9a9a]"
                      />

                      <div className="grid grid-cols-2 border-b border-[#d9d9d9]">
                        <input
                          value={formValues.city}
                          onChange={handleInputChange("city")}
                          type="text"
                          placeholder="City"
                          className="w-full border-r border-[#d9d9d9] px-3 py-2 text-[#4d4d4d] outline-none placeholder:text-[#9a9a9a]"
                        />
                        <input
                          value={formValues.postalCode}
                          onChange={handleInputChange("postalCode")}
                          type="text"
                          placeholder="Postal code"
                          className="w-full px-3 py-2 text-[#4d4d4d] outline-none placeholder:text-[#9a9a9a]"
                        />
                      </div>

                      <input
                        value={formValues.state}
                        onChange={handleInputChange("state")}
                        type="text"
                        placeholder="State"
                        className="w-full px-3 py-2 text-[#4d4d4d] outline-none placeholder:text-[#9a9a9a]"
                      />
                    </div>
                  </div>

                  {errorMessage ? (
                    <p className="text-sm text-[#c13535]">{errorMessage}</p>
                  ) : null}
                  {successMessage ? (
                    <p className="text-sm text-[#14813d]">{successMessage}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting || !plan}
                    className="w-full rounded-md bg-[#5a9df2] py-2.5 text-base font-semibold text-white transition hover:bg-[#4b8de2] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {subscribeButtonLabel}
                  </button>

                  <p className="text-center text-xs text-[#7a7a7a]">
                    {isLoading
                      ? "Preparing checkout..."
                      : !plan
                        ? "No subscription plan is currently available."
                        : "By subscribing, you agree to recurring monthly billing."}
                  </p>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function StripeCheckout() {
  if (!publishableKey || !stripePromise) {
    return (
      <div className="min-h-screen bg-zinc-100">
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Stripe publishable key is missing. Set VITE_STRIPE_PUBLISHABLE_KEY
            in your .env file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm />
    </Elements>
  );
}

export default StripeCheckout;
