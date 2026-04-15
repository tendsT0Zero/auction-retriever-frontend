// PropertySection component.
import React from "react";
import PropertyCard from "../common/PropertyCard";

function PropertySection({ properties, onToggleFavourite }) {
  return (
    <div className="w-full container mx-auto mt-4 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}

export default PropertySection;
