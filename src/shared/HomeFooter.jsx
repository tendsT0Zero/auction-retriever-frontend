import React from "react";
import { Link } from "react-router-dom";
function HomeFooter() {
  return (
    <div className="bg-zinc-600 text-center sm:text-left">
      <div className="container mx-auto px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* auction footer title */}
          <div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <img
                src="../public/auction-icon.png"
                alt="auction icon"
                className="h-7 w-7"
              />
              <h1 className="text-2xl font-bold text-amber-400">
                Auction Retriever
              </h1>
            </div>
          </div>
          {/* auction social media links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <Link to={"#"}>
              <img
                src="../public/fblogo.png"
                alt="Facebook"
                className="h-6 w-6"
              />
            </Link>
            <Link to={"#"}>
              <img
                src="../public/XLogo.png"
                alt="Twitter"
                className="h-6 w-6"
              />
            </Link>
            <Link to={"#"}>
              <img
                src="../public/InstagramLogo.png"
                alt="Instagram"
                className="h-6 w-6"
              />
            </Link>
            <Link to={"#"}>
              <img
                src="../public/linkedin-icon.png"
                alt="LinkedIn"
                className="h-6 w-6"
              />
            </Link>
          </div>
        </div>
      </div>
      {/* auction copyright */}
      <div>
        <p className="text-center text-zinc-400 text-[12px] py-4">
          &copy; {new Date().getFullYear()} Auction Retriever. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}

export default HomeFooter;
