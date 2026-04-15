import React from "react";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fcf6ea] to-[#fce49c] font-sans">
      <div className="container mx-auto min-h-screen w-full px-4 sm:px-6 flex flex-col">
        <Header />

        <main className="relative flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div
            className="absolute inset-0 z-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
          ></div>

          {/* Form Container */}
          <div className="relative z-10 w-full flex justify-center">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default AuthLayout;
