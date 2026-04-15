// PropertyCard component.
import React, { useEffect, useState } from "react";
import { GrFavorite } from "react-icons/gr";
import { FiExternalLink } from "react-icons/fi";

function PropertyCard({ property, onToggleFavourite }) {
  const [isFavourite, setIsFavourite] = useState(!!property.isFavourite);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsFavourite(!!property.isFavourite);
  }, [property.isFavourite]);

  const toggleFavourite = async () => {
    if (isSaving) return;
    const nextValue = !isFavourite;

    if (!onToggleFavourite) {
      setIsFavourite(nextValue);
      return;
    }

    try {
      setIsSaving(true);
      const result = await onToggleFavourite(property, nextValue);
      if (typeof result === "boolean") {
        setIsFavourite(result);
      } else {
        setIsFavourite(nextValue);
      }
    } catch (error) {
      console.error("Failed to update favourite:", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md">
      <div className="relative ">
        <img
          src={property.image}
          alt={property.address}
          className="w-full h-48 object-cover rounded-md"
        />

        <button
          onClick={toggleFavourite}
          disabled={isSaving}
          className="absolute top-2 right-3 p-2 rounded-full bg-gray-300"
        >
          <GrFavorite
            size={22}
            fill="yellow"
            className={
              isFavourite
                ? "text-white bg-amber-300 p-0 rounded-full"
                : "text-gray-600"
            }
          />
        </button>
        <span className="absolute top-2 left-3 bg-amber-400 text-white text-[10px] font-semibold py-1 px-2 rounded-md">
          {property.tag}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-3">
        <h2 className="text-base text-amber-400 sm:text-xl">
          {property.price} starting bid
        </h2>
        <p className="text-base text-zinc-800 sm:text-xl">{property.address}</p>
        <p className="text-xs sm:text-[12px]">{property.location}</p>
        <p className="text-xs sm:text-[12px]">{property.date}</p>
        <span className="mt-4 flex flex-row gap-2 justify-between px-1 sm:flex-row sm:items-center sm:justify-between">
          <button className="flex items-center gap-2 rounded-md bg-amber-400 px-2 py-1 text-[11px] font-semibold text-zinc-800">
            View Listing <FiExternalLink />
          </button>
          <p className="rounded-md bg-amber-100 px-2 py-1 text-[11px] text-zinc-600">
            {property.source}
          </p>
        </span>
      </div>
    </div>
  );
}

export default PropertyCard;
