// BenefitsSection component.
import React from "react";

function BenefitsSection({ benefits }) {
  return (
    <div className="container mx-auto px-4 sm:px-6">
      <h1 className="mx-auto mt-6 w-full max-w-xl p-2 text-center text-2xl font-bold text-zinc-600 sm:text-3xl">
        Search smarter. Find better deals faster.
      </h1>

      <div className="mx-auto mt-8 flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-evenly">
        <div className="flex w-full max-w-xl flex-col gap-4 p-1">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="mb-2 flex items-start gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 sm:h-[60px] sm:w-[60px]">
                <img
                  src={benefit.icon}
                  alt={benefit.title}
                  className="h-7 w-7 object-cover sm:h-9 sm:w-9"
                />
              </span>
              <div>
                <h3 className="text-base font-bold text-zinc-500 sm:text-lg">
                  {benefit.title}
                </h3>
                <p className="text-sm text-zinc-400 sm:text-[16px]">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <img
          src="/Benefitsectionimage.png"
          alt="business discussion"
          className="h-auto w-full max-w-md rounded-lg object-cover sm:max-w-lg"
        />
      </div>
    </div>
  );
}

export default BenefitsSection;
