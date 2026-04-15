// WelcomeSection component.
import React from "react";
import { useUserProfile } from "../../hooks/useUserProfile";

function WelcomeSection() {
  const { user, loading } = useUserProfile();
  const userName = user?.name || "User";

  return (
    <div className="w-full container mx-auto px-4 sm:px-6">
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900 sm:text-3xl md:text-4xl">
        Welcome, {loading ? "..." : userName}!
      </h1>
      <p className="text-zinc-400">Browse verified auction listings.</p>
    </div>
  );
}

export default WelcomeSection;
