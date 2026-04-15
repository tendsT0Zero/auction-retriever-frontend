import React from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 md:px-12">
      {/* Logo */}
      <Link to="/">
        <img
          src="/app-logo-auction-retriver.png"
          alt="Auction Retriever Logo"
          className="h-10 w-auto object-contain sm:h-12"
        />
      </Link>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-800 transition-colors hover:text-slate-600 sm:text-base md:text-[18px]"
      >
        <IoChevronBackSharp size={22} className="mt-0.5" />
        Back
      </button>
    </header>
  );
}

export default Header;
