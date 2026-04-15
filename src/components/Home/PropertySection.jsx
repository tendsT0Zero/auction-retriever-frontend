// PropertySection component.
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "../common/PropertyCard";
import SpinnerLoader from "../common/SpinnerLoader";
import { authStorage } from "../../services/authService";
import {
  getHomeRandomAuctions,
  saveAuction,
} from "../../services/auctionService";

const formatType = (type) => {
  if (!type) return "Property";
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const extractAddress = (title) => {
  if (!title) return "";
  return title.split(" - ")[0].trim();
};

function PropertySection() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getHomeRandomAuctions();
        const data = response.data || response;
        const list = Array.isArray(data) ? data : data.data || [];
        setAuctions(list);
      } catch (err) {
        setError(err.message || "Failed to load auctions");
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const properties = useMemo(() => {
    return auctions.map((auction) => ({
      id: auction.id,
      tag: formatType(auction.type),
      image:
        (auction.image_url && auction.image_url.trim()) ||
        (auction.image && auction.image.trim()) ||
        "./public/property-images/propertyimage1.png",
      price: auction.bid_amount
        ? `$${Number(auction.bid_amount).toLocaleString()}`
        : "$0",
      address: extractAddress(auction.title) || "",
      location: `${auction.county || ""}, ${auction.state || ""}`.trim(),
      date: auction.auction_date
        ? new Date(auction.auction_date).toLocaleDateString()
        : new Date().toLocaleDateString(),
      source: auction.source_name || "Unknown",
      isFavourite: auction.is_saved || false,
    }));
  }, [auctions]);

  const handleToggleFavourite = async (property, nextValue) => {
    try {
      const token = authStorage.getToken();

      if (!token) {
        setError("Please login to save listings");
        return false;
      }

      const response = await saveAuction(property.id, token);

      if (response.status || response.success) {
        setAuctions((prev) =>
          prev.map((auction) =>
            auction.id === property.id
              ? { ...auction, is_saved: nextValue }
              : auction,
          ),
        );
        return nextValue;
      }

      setError(response.message || "Failed to update saved listing");
      return !nextValue;
    } catch (err) {
      setError(err.message || "Failed to update saved listing");
      return !nextValue;
    }
  };
  return (
    <div className="flex flex-col items-center gap-6 py-12 px-4 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-zinc-700 sm:text-3xl">
          Browse Thousands of Property
          <br /> Auctions in One Place
        </h1>
        <p className="text-xs text-zinc-600 sm:text-sm">
          Stop jumping between auction websites. Auction Retriever aggregates
          listings across major <br />
          auction platforms and organizes them into one powerful search
          dashboard.
        </p>
      </div>
      {loading ? (
        <div className="mt-2 text-center">
          <SpinnerLoader size="lg" />
        </div>
      ) : error ? (
        <div className="mt-2 text-center text-sm text-red-600">{error}</div>
      ) : (
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}

      <Link
        to="/dashboard"
        className="mt-5 block rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-amber-500 sm:text-base"
      >
        View All Properties
      </Link>
    </div>
  );
}

export default PropertySection;
