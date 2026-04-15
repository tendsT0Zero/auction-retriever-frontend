// BillingHistoryTable component.
import React from "react";
import { FiDownload } from "react-icons/fi";

function BillingHistoryTable({
  history,
  onDownloadAll,
  onDownloadInvoice,
  onLoadMore,
  statusMessage,
}) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white/70 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Billing history</p>
          <p className="text-xs text-zinc-500">
            Manage billing information and view receipts
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700"
          onClick={onDownloadAll}
        >
          All download <FiDownload size={14} />
        </button>
      </div>
      <div className="mt-4 hidden grid-cols-[1.4fr_0.7fr_0.7fr_0.4fr] text-xs text-amber-600 sm:grid">
        <span>Invoice Date</span>
        <span>Amount</span>
        <span>Date</span>
        <span>Receipt</span>
      </div>
      <div className="mt-2 space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="rounded-lg bg-white/80 px-3 py-3 text-xs text-zinc-600"
          >
            <div className="flex flex-col gap-1 sm:hidden">
              <span className="text-amber-700">{item.title}</span>
              <div className="flex items-center justify-between">
                <span>{item.amount}</span>
                <span>{item.date}</span>
                <button
                  type="button"
                  className="rounded-md border border-amber-200 px-2 py-1 text-[10px] text-amber-700"
                  onClick={() => onDownloadInvoice(item)}
                >
                  <FiDownload size={12} />
                </button>
              </div>
            </div>
            <div className="hidden items-center grid-cols-[1.4fr_0.7fr_0.7fr_0.4fr] sm:grid">
              <span className="text-amber-700">{item.title}</span>
              <span>{item.amount}</span>
              <span>{item.date}</span>
              <button
                type="button"
                className="mx-auto rounded-md border border-amber-200 px-2 py-1 text-[10px] text-amber-700"
                onClick={() => onDownloadInvoice(item)}
              >
                <FiDownload size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          className="text-xs text-amber-600"
          onClick={onLoadMore}
        >
          Load more
        </button>
        {statusMessage ? (
          <span className="text-xs text-amber-600">{statusMessage}</span>
        ) : null}
      </div>
    </div>
  );
}

export default BillingHistoryTable;
