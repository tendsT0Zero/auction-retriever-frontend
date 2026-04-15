// AccountTabs component.
import React from "react";

function AccountTabs({ activeTab, onChange }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-amber-100 text-sm">
      <button
        type="button"
        className={
          "pb-2 " +
          (activeTab === "profile"
            ? "border-b-2 border-amber-400 text-amber-600"
            : "text-zinc-500")
        }
        onClick={() => onChange("profile")}
      >
        Profile
      </button>
      <button
        type="button"
        className={
          "pb-2 " +
          (activeTab === "subscription"
            ? "border-b-2 border-amber-400 text-amber-600"
            : "text-zinc-500")
        }
        onClick={() => onChange("subscription")}
      >
        Subscriptions
      </button>
    </div>
  );
}

export default AccountTabs;
