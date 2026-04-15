import { Link } from "react-router-dom";
import homeLogo from "../../public/app-logo-auction-retriver.png";
import { useState, useEffect } from "react";
import { authStorage } from "../services/authService";

export default function HomeHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthenticated = Boolean(authStorage.getToken());

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`w-full fixed top-0 left-0 z-50 transition-colors duration-300 ${isScrolled ? "bg-white" : "bg-transparent"}`}
      onScroll={() => setIsScrolled(window.scrollY > 0)}
    >
      <div className="w-full container mx-auto flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* left side */}
        <Link to="/">
          <img
            src={homeLogo}
            alt="Auction Retriever"
            className="h-10 w-auto object-contain sm:h-12"
          />
        </Link>

        {/* right side */}
        <div className="flex flex-col items-start gap-3 text-sm sm:flex-row sm:items-center sm:gap-10 sm:text-base">
          {isAuthenticated ? (
            <Link to="/dashboard" className="font-medium text-zinc-700">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to={"/auth"} className="font-medium text-zinc-700">
                login
              </Link>

              <Link
                to={"/auth/signup"}
                className="rounded-md bg-zinc-900 px-4 py-2 text-xs font-bold text-amber-300 sm:text-[11px]"
              >
                Start 7-Days Free Trial
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
