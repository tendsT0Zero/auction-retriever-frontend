// AuctionOpportunitySection component.
import React from "react";

const auctionOpportunities = [
  {
    id: 1,
    iconUrl: "../public/Search.png",
    title: "Multi Platform Auction Search",
    description:
      "Instantly browse property auctions from multiple auction websites in one unified dashboard.",
  },
  {
    id: 2,
    iconUrl: "../public/Notification.png",
    title: "Powerful Property Filters",
    description:
      "Quickly filter auctions by state, county, property type, starting bid, and auction date to find deals that fit your strategy.",
  },
  {
    id: 3,
    iconUrl: "../public/digesticon.png",

    title: "Weekly Auction Digest",
    description:
      "Receive a curated weekly email with the most interesting and undervalued auctions across the country.",
  },
];

function AuctionOpportunitySection() {
  return (
    <div className="bg-yellow-700 flex flex-col items-center gap-8 py-12 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
          Everything You Need to Find Auction Opportunities
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {auctionOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="mx-auto flex w-full max-w-sm items-start gap-3 rounded-md bg-white p-4"
            >
              <img
                src={opportunity.iconUrl}
                alt={opportunity.title}
                className="h-12 w-12 object-cover sm:h-16 sm:w-16"
              />
              <div>
                <h3 className="text-base font-bold sm:text-lg">
                  {opportunity.title}
                </h3>
                <p className="text-sm text-zinc-600 sm:text-base">
                  {opportunity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuctionOpportunitySection;
