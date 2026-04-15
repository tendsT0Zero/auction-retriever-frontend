import React, { useState, useEffect } from "react";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import DashboardHeader from "../../shared/DashboardHeader";
import AccountTabs from "../../components/dashboard/account/AccountTabs";
import ProfileTab from "../../components/dashboard/account/ProfileTab";
import SubscriptionTab from "../../components/dashboard/account/SubscriptionTab";
import ConfirmModal from "../../components/dashboard/account/ConfirmModal";
import { authStorage } from "../../services/authService";
import {
  updateProfile,
  changePassword,
  updateAvatar,
  deleteProfile,
  getUserProfile,
} from "../../services/profileService";
import {
  cancelSubscription,
  getSubscriptionPlans,
  getSubscriptionStatus,
} from "../../services/subscriptionService";

const DEFAULT_AVATAR_PLACEHOLDER = "/profile-photo-placeholder.png";

const defaultSubscriptionPlan = {
  name: "Pro Access Plan",
  status: "Inactive",
  started: "Not available",
  renews: "Not available",
  price: "$0.00",
  interval: "month",
  trialDays: 0,
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

const billingHistory = [
  {
    id: 1,
    title: "30-Day Access - Oct. 21, 2025",
    amount: "USD $10.00",
    date: "Oct. 21, 2025",
  },
  {
    id: 2,
    title: "30-Day Access - Oct. 21, 2025",
    amount: "USD $10.00",
    date: "Oct. 21, 2025",
  },
  {
    id: 3,
    title: "30-Day Access - Oct. 21, 2025",
    amount: "USD $10.00",
    date: "Oct. 21, 2025",
  },
  {
    id: 4,
    title: "30-Day Access - Oct. 21, 2025",
    amount: "USD $10.00",
    date: "Oct. 21, 2025",
  },
];

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

const pickPlanById = (plans, planId) => {
  if (!Array.isArray(plans) || plans.length === 0) {
    return null;
  }

  if (planId === undefined || planId === null || `${planId}`.trim() === "") {
    return plans[0];
  }

  const stringId = String(planId);
  return (
    plans.find((item) => String(item?.id ?? item?.plan_id) === stringId) ||
    plans[0]
  );
};

const formatPlanPrice = (price, fallbackPrice) => {
  const amount = Number(price);
  if (!Number.isFinite(amount)) {
    return fallbackPrice;
  }
  return `$${amount.toFixed(2)}`;
};

const buildSubscriptionPlan = (plan, fallback) => {
  if (!plan) return fallback;

  const trialDays = Number.isFinite(Number(plan.trial_days))
    ? Number(plan.trial_days)
    : fallback.trialDays;

  return {
    ...fallback,
    name: plan.name || fallback.name,
    price: formatPlanPrice(plan.price, fallback.price),
    interval: plan.interval || fallback.interval,
    trialDays,
    features:
      Array.isArray(plan.features) && plan.features.length > 0
        ? plan.features
        : fallback.features,
  };
};

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return "";
  return parsed.toLocaleDateString();
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return null;
  return parsed;
};

const resolveProfileSubscriptionDetails = (userData) => {
  const subscription = userData?.subscription;

  if (!subscription || typeof subscription !== "object") {
    return {
      hasProfileSubscription: false,
      subscriptionPlanId: null,
      status: "Inactive",
      started: "Not available",
      renews: "Not available",
      canCancel: false,
    };
  }

  const now = new Date();
  const trialEndsAt = parseDate(subscription.trial_ends_at);
  const endsAt = parseDate(subscription.ends_at);
  const startedAt =
    parseDate(subscription.starts_at) ||
    parseDate(subscription.start_date) ||
    parseDate(subscription.created_at);
  const isActive = Boolean(subscription.active);
  const isCanceled = Boolean(subscription.canceled);
  const isOnGrace = Boolean(subscription.on_grace);

  let status = "Inactive";

  if (isOnGrace || (isActive && isCanceled)) {
    status = "On Grace";
  } else if (isActive && trialEndsAt && trialEndsAt > now) {
    status = "Trial Active";
  } else if (isActive) {
    status = "Active";
  } else if (isCanceled) {
    status = "Cancelled";
  }

  const renews =
    ((isCanceled || isOnGrace) && endsAt && formatDate(endsAt)) ||
    (trialEndsAt && trialEndsAt > now && formatDate(trialEndsAt)) ||
    (endsAt && formatDate(endsAt)) ||
    "Not available";

  return {
    hasProfileSubscription: true,
    subscriptionPlanId:
      subscription.subscription_plan_id ?? subscription.plan_id ?? null,
    status,
    started: (startedAt && formatDate(startedAt)) || "Not available",
    renews,
    canCancel: isActive && !isCanceled,
  };
};

const resolveStatusDetails = (payload) => {
  const data = payload?.data ?? payload;

  if (!data || typeof data !== "object") {
    return {};
  }

  const statusCandidates = [
    data.subscription?.status,
    data.subscription_status,
    data.plan_status,
    data.status,
  ];
  const stringStatus = statusCandidates.find(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
  const booleanStatus = [
    data.active,
    data.subscription?.active,
    data.subscription_active,
  ].find((value) => typeof value === "boolean");

  const status =
    stringStatus ||
    (typeof booleanStatus === "boolean"
      ? booleanStatus
        ? "Active"
        : "Inactive"
      : "");

  const startedRaw =
    data.started ||
    data.starts_at ||
    data.start_date ||
    data.current_period_start ||
    data.subscription?.started ||
    data.subscription?.starts_at ||
    data.subscription?.start_date ||
    data.subscription?.current_period_start ||
    "";
  const renewsRaw =
    data.renews ||
    data.renews_at ||
    data.current_period_end ||
    data.trial_ends_at ||
    data.ends_at ||
    data.subscription?.renews ||
    data.subscription?.renews_at ||
    data.subscription?.trial_ends_at ||
    data.subscription?.ends_at ||
    data.subscription?.current_period_end ||
    "";

  return {
    status,
    started: formatDate(startedRaw),
    renews: formatDate(renewsRaw),
  };
};

const resolveAvatarFromPayload = (payload) => {
  const data = payload?.data ?? payload;

  if (!data || typeof data !== "object") {
    return "";
  }

  return (
    data.avatar ||
    data.user?.avatar ||
    data.profile?.avatar ||
    data.data?.avatar ||
    ""
  );
};

function Account() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_PLACEHOLDER);
  const [planDetails, setPlanDetails] = useState(defaultSubscriptionPlan);
  const [planStatus, setPlanStatus] = useState(defaultSubscriptionPlan.status);
  const [subscriptionMeta, setSubscriptionMeta] = useState({
    planId: null,
    canCancel: false,
    hasProfileSubscription: false,
  });
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [status, setStatus] = useState({
    avatar: "",
    account: "",
    password: "",
    subscription: "",
    billing: "",
    action: "",
  });
  const [loading, setLoading] = useState({
    avatar: false,
    account: false,
    password: false,
    delete: false,
    profile: true,
  });

  const flashStatus = (key, message) => {
    setStatus((prev) => ({ ...prev, [key]: message }));
    setTimeout(() => {
      setStatus((prev) => ({ ...prev, [key]: "" }));
    }, 2400);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = authStorage.getToken();

        if (!token) {
          setLoading((prev) => ({ ...prev, profile: false }));
          return;
        }

        const response = await getUserProfile(token);

        if (response.status || response.success) {
          const userData = response.data || response;
          const subscriptionDetails =
            resolveProfileSubscriptionDetails(userData);

          setFullName(userData.name || "");
          setEmailAddress(userData.email || "");
          setAvatarUrl(userData.avatar || DEFAULT_AVATAR_PLACEHOLDER);
          setPlanStatus(subscriptionDetails.status);
          setPlanDetails((prev) => ({
            ...prev,
            status: subscriptionDetails.status,
            started: subscriptionDetails.started,
            renews: subscriptionDetails.renews,
          }));
          setSubscriptionMeta({
            planId: subscriptionDetails.subscriptionPlanId,
            canCancel: subscriptionDetails.canCancel,
            hasProfileSubscription: subscriptionDetails.hasProfileSubscription,
          });
          authStorage.setUser(userData);
        } else {
          console.error("Failed to fetch user profile:", response.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      } finally {
        setLoading((prev) => ({ ...prev, profile: false }));
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      const token = authStorage.getToken();

      if (!token) {
        return;
      }

      try {
        const planResponse = await getSubscriptionPlans(token);
        const planData = pickPlanById(
          extractPlanList(planResponse),
          subscriptionMeta.planId,
        );

        if (planData) {
          setPlanDetails((prev) => ({
            ...buildSubscriptionPlan(planData, defaultSubscriptionPlan),
            started: prev.started,
            renews: prev.renews,
          }));
          if (!subscriptionMeta.hasProfileSubscription && planData.status) {
            setPlanStatus(planData.status);
          }
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error.message);
      }

      if (subscriptionMeta.hasProfileSubscription) {
        return;
      }

      try {
        const statusResponse = await getSubscriptionStatus(token);
        const statusDetails = resolveStatusDetails(statusResponse);

        if (statusDetails.status) {
          setPlanStatus(statusDetails.status);
        }

        if (statusDetails.started || statusDetails.renews) {
          setPlanDetails((prev) => ({
            ...prev,
            started: statusDetails.started || prev.started,
            renews: statusDetails.renews || prev.renews,
          }));
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error.message);
      }
    };

    fetchSubscriptionData();
  }, [subscriptionMeta.hasProfileSubscription, subscriptionMeta.planId]);

  const handleAvatarSelect = (file) => {
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    setAvatarUrl(nextUrl);
    setSelectedAvatarFile(file);
    flashStatus("avatar", "Image selected");
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatarFile) {
      flashStatus("avatar", "Please select an image first");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, avatar: true }));
      const token = authStorage.getToken();

      if (!token) {
        flashStatus("avatar", "Please login first");
        return;
      }

      const response = await updateAvatar(selectedAvatarFile, token);

      if (response.status || response.success) {
        const updatedAvatarUrl = resolveAvatarFromPayload(response);

        if (updatedAvatarUrl) {
          setAvatarUrl(updatedAvatarUrl);
          authStorage.updateUser({ avatar: updatedAvatarUrl });
        } else {
          try {
            const refreshedProfile = await getUserProfile(token);
            if (refreshedProfile.status || refreshedProfile.success) {
              const userData = refreshedProfile.data || refreshedProfile;
              setAvatarUrl(userData.avatar || DEFAULT_AVATAR_PLACEHOLDER);
              setFullName(userData.name || fullName);
              setEmailAddress(userData.email || emailAddress);
              authStorage.setUser(userData);
            }
          } catch (refreshError) {
            console.error(
              "Error refreshing profile after avatar update:",
              refreshError.message,
            );
          }
        }

        flashStatus("avatar", "Profile image updated successfully");
        setSelectedAvatarFile(null);
      } else {
        flashStatus("avatar", response.message || "Failed to update avatar");
      }
    } catch (error) {
      flashStatus("avatar", error.message || "Failed to update avatar");
    } finally {
      setLoading((prev) => ({ ...prev, avatar: false }));
    }
  };

  const handleSaveAccount = async () => {
    if (!fullName.trim() || !emailAddress.trim()) {
      flashStatus("account", "Please fill required fields");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, account: true }));
      const token = authStorage.getToken();

      if (!token) {
        flashStatus("account", "Please login first");
        return;
      }

      const profileData = {
        name: fullName,
        email: emailAddress,
      };

      const response = await updateProfile(profileData, token);

      if (response.status || response.success) {
        authStorage.updateUser({
          name: fullName,
          email: emailAddress,
        });
        flashStatus("account", "Account updated successfully");
      } else {
        flashStatus("account", response.message || "Failed to update account");
      }
    } catch (error) {
      flashStatus("account", error.message || "Failed to update account");
    } finally {
      setLoading((prev) => ({ ...prev, account: false }));
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword.trim()) {
      flashStatus("password", "Please enter current password");
      return;
    }

    if (!newPassword.trim()) {
      flashStatus("password", "Please enter new password");
      return;
    }

    if (newPassword.length < 8) {
      flashStatus("password", "Password must be at least 8 characters");
      return;
    }

    if (currentPassword === newPassword) {
      flashStatus("password", "New password must be different");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, password: true }));
      const token = authStorage.getToken();

      if (!token) {
        flashStatus("password", "Please login first");
        return;
      }

      const response = await changePassword(
        currentPassword,
        newPassword,
        token,
      );

      if (response.status || response.success) {
        flashStatus("password", "Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        flashStatus(
          "password",
          response.message || "Failed to update password",
        );
      }
    } catch (error) {
      flashStatus("password", error.message || "Failed to update password");
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  const handleCancelPlan = async () => {
    try {
      const token = authStorage.getToken();

      if (!token) {
        flashStatus("subscription", "Please login first");
        return;
      }

      const response = await cancelSubscription(token);

      if (response.status || response.success) {
        try {
          const refreshedProfile = await getUserProfile(token);
          if (refreshedProfile.status || refreshedProfile.success) {
            const userData = refreshedProfile.data || refreshedProfile;
            const subscriptionDetails =
              resolveProfileSubscriptionDetails(userData);
            setPlanStatus(subscriptionDetails.status);
            setPlanDetails((prev) => ({
              ...prev,
              started: subscriptionDetails.started,
              renews: subscriptionDetails.renews,
            }));
            setSubscriptionMeta({
              planId: subscriptionDetails.subscriptionPlanId,
              canCancel: subscriptionDetails.canCancel,
              hasProfileSubscription:
                subscriptionDetails.hasProfileSubscription,
            });
            authStorage.setUser(userData);
          } else {
            setPlanStatus("Cancelled");
            setSubscriptionMeta((prev) => ({
              ...prev,
              canCancel: false,
              hasProfileSubscription: true,
            }));
          }
        } catch (refreshError) {
          console.error(
            "Error refreshing subscription after cancel:",
            refreshError.message,
          );
          setPlanStatus("Cancelled");
          setSubscriptionMeta((prev) => ({
            ...prev,
            canCancel: false,
            hasProfileSubscription: true,
          }));
        }

        flashStatus("subscription", response.message || "Plan cancelled");
      } else {
        flashStatus(
          "subscription",
          response.message || "Failed to cancel plan",
        );
      }
    } catch (error) {
      flashStatus("subscription", error.message || "Failed to cancel plan");
    }
  };

  const handleDownloadAll = () => {
    flashStatus("billing", "Receipts ready");
  };

  const handleDownloadInvoice = (item) => {
    if (!item) return;
    flashStatus("billing", "Receipt downloaded");
  };

  const handleLoadMore = () => {
    flashStatus("billing", "No more invoices");
  };

  const handleConfirmLogout = () => {
    setShowLogout(false);
    // Clear auth data and redirect to login
    authStorage.clearToken();
    authStorage.clearUser();
    flashStatus("action", "Logged out successfully");
    setTimeout(() => {
      window.location.href = "/auth";
    }, 1500);
  };

  const handleConfirmDelete = async () => {
    setShowDelete(false);

    try {
      setLoading((prev) => ({ ...prev, delete: true }));
      const token = authStorage.getToken();

      if (!token) {
        flashStatus("action", "Please login first");
        return;
      }

      const response = await deleteProfile(token);

      if (response.status || response.success) {
        flashStatus("action", "Account deleted successfully");
        // Clear auth data and redirect to login
        authStorage.clearToken();
        authStorage.clearUser();
        setTimeout(() => {
          window.location.href = "/auth";
        }, 1500);
      } else {
        flashStatus("action", response.message || "Failed to delete account");
      }
    } catch (error) {
      flashStatus("action", error.message || "Failed to delete account");
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200">
      <DashboardHeader />
      <div className="w-full container mx-auto px-4 pb-16">
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Account Settings
            </h1>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white"
            onClick={() => setShowLogout(true)}
          >
            Logout <FiLogOut size={14} />
          </button>
        </div>

        {status.action ? (
          <p className="mt-2 text-xs text-amber-600">{status.action}</p>
        ) : null}

        <AccountTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "profile" ? (
          <ProfileTab
            avatarUrl={avatarUrl}
            onAvatarSelect={handleAvatarSelect}
            onSaveAvatar={handleSaveAvatar}
            avatarStatus={status.avatar}
            fullName={fullName}
            emailAddress={emailAddress}
            onFullNameChange={(event) => setFullName(event.target.value)}
            onEmailChange={(event) => setEmailAddress(event.target.value)}
            onSaveAccount={handleSaveAccount}
            accountStatus={status.account}
            currentPassword={currentPassword}
            newPassword={newPassword}
            onCurrentPasswordChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            onNewPasswordChange={(event) => setNewPassword(event.target.value)}
            showCurrentPassword={showCurrentPassword}
            showNewPassword={showNewPassword}
            onToggleCurrentPassword={() =>
              setShowCurrentPassword((prev) => !prev)
            }
            onToggleNewPassword={() => setShowNewPassword((prev) => !prev)}
            onSavePassword={handleSavePassword}
            passwordStatus={status.password}
            onDeleteAccount={() => setShowDelete(true)}
            isLoading={loading}
          />
        ) : (
          <SubscriptionTab
            plan={planDetails}
            planStatus={planStatus}
            canCancel={subscriptionMeta.canCancel}
            onCancelPlan={handleCancelPlan}
            statusMessage={status.subscription}
            billingHistory={billingHistory}
            onDownloadAll={handleDownloadAll}
            onDownloadInvoice={handleDownloadInvoice}
            onLoadMore={handleLoadMore}
            billingStatus={status.billing}
          />
        )}
      </div>
      <ConfirmModal
        open={showLogout}
        icon={<FiLogOut />}
        title="Logout"
        message="Are you sure you want to Logout to Auction Retriever?"
        confirmLabel="Yes, Logout"
        cancelLabel="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogout(false)}
      />

      <ConfirmModal
        open={showDelete}
        icon={<FiTrash2 />}
        title="Delete Account"
        message="Are you sure you want to Delete Account to Auction Retriever?"
        confirmLabel="Delete Account"
        cancelLabel="Cancel"
        confirmTone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}

export default Account;
