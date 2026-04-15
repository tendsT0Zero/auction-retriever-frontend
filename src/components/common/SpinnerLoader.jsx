import React from "react";

function SpinnerLoader({ size = "md", className = "" }) {
  const sizeClass =
    size === "sm"
      ? "h-5 w-5 border-2"
      : size === "lg"
        ? "h-10 w-10 border-4"
        : "h-8 w-8 border-4";

  return (
    <div
      className={`inline-block animate-spin rounded-full border-amber-200 border-t-amber-500 ${sizeClass} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default SpinnerLoader;
