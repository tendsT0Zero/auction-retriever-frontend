// DashboardHeader component.
import React from "react";
import { NavLink } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";

function DashboardHeader() {
  const { user } = useUserProfile();
  const avatarUrl = user?.avatar || "/profile-photo-placeholder.png";

  return (
    <div className="w-full container mx-auto flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Logo */}
        <NavLink to="/">
          <img
            src="/app-logo-auction-retriver.png"
            alt="logo"
            className="h-10 w-auto object-contain sm:h-12"
          />
        </NavLink>

        {/* Navigation Links */}
        <div className="flex w-full gap-2 rounded-full bg-gray-200 p-1 text-xs sm:w-auto sm:gap-3 sm:text-sm overflow-x-auto sm:overflow-visible whitespace-nowrap">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block text-center rounded-full px-3 py-2 sm:p-3 ${isActive ? "bg-amber-300" : ""}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/saved-listings"
            className={({ isActive }) =>
              `block text-center rounded-full px-3 py-2 sm:p-3 ${isActive ? "bg-amber-300" : ""}`
            }
          >
            Saved Listings
          </NavLink>

          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              `block text-center rounded-full px-3 py-2 sm:p-3 ${isActive ? "bg-amber-300" : ""}`
            }
          >
            Accounts
          </NavLink>
        </div>
      </div>

      {/* User Profile */}
      <div>
        <NavLink to="/accounts">
          <img
            src={avatarUrl}
            alt="User Profile"
            className="h-10 w-10 rounded-full border-amber-500 border-3 object-cover sm:h-12 sm:w-12 md:h-[50px] md:w-[50px]"
          />
        </NavLink>
      </div>
    </div>
  );
}

export default DashboardHeader;
