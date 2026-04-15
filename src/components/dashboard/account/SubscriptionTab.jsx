// SubscriptionTab component.
import React from "react";
import BillingHistoryTable from "./BillingHistoryTable";

function SubscriptionTab({
  plan,
  planStatus,
  canCancel = false,
  onCancelPlan,
  statusMessage,
  billingHistory,
  onDownloadAll,
  onDownloadInvoice,
  onLoadMore,
  billingStatus,
}) {
  const normalizedStatus = String(planStatus || "").toLowerCase();
  const statusClass =
    normalizedStatus.includes("active") || normalizedStatus.includes("trial")
      ? "bg-green-100 text-green-700"
      : normalizedStatus.includes("grace")
        ? "bg-amber-100 text-amber-700"
        : normalizedStatus.includes("cancel")
          ? "bg-red-100 text-red-700"
          : "bg-zinc-200 text-zinc-600";
  const features = Array.isArray(plan?.features) ? plan.features : [];
  const planName = plan?.name || "Plan";
  const started = plan?.started || "Not available";
  const renews = plan?.renews || "Not available";

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-2xl border border-amber-100 bg-white/70 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Current Plan
            </h2>
            <p className="text-xs text-zinc-500">Plan: {planName}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs ${statusClass}`}>
            {planStatus}
          </span>
        </div>
        <div className="mt-4 border-t border-amber-100 pt-4">
          <p className="text-sm font-semibold text-zinc-700">Duration</p>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-zinc-500">
            <span>Started: {started}</span>
            <span>Renews: {renews}</span>
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-xs text-zinc-600">
          {features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center gap-3">
          {canCancel ? (
            <button
              type="button"
              className="rounded-md bg-red-500 px-4 py-2 text-xs font-semibold text-white"
              onClick={onCancelPlan}
            >
              Cancel
            </button>
          ) : null}
          {statusMessage ? (
            <span className="text-xs text-amber-600">{statusMessage}</span>
          ) : null}
        </div>
      </div>

      <BillingHistoryTable
        history={billingHistory}
        onDownloadAll={onDownloadAll}
        onDownloadInvoice={onDownloadInvoice}
        onLoadMore={onLoadMore}
        statusMessage={billingStatus}
      />
    </div>
  );
}

export default SubscriptionTab;
