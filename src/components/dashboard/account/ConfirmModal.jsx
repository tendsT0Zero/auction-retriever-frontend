// ConfirmModal component.
import React from "react";

function ConfirmModal({
  open,
  icon,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  confirmTone = "primary",
}) {
  if (!open) return null;

  const confirmClass =
    confirmTone === "danger"
      ? "bg-red-600 text-white"
      : "bg-amber-400 text-zinc-900";

  const iconClass =
    confirmTone === "danger"
      ? "bg-red-100 text-red-600"
      : "bg-amber-100 text-amber-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-[320px] rounded-2xl bg-white p-6 text-center">
        <div
          className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full ${iconClass}`}
        >
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        <p className="mt-1 text-xs text-zinc-500">{message}</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            className="rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-600"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-xs font-semibold ${confirmClass}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
