"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";

const categories = [
  "All Categories",
  "Home & Garden",
  "Kitchen",
  "Fashion",
  "Beauty",
  "Stationery",
  "Jewelry",
  "Toys & Games",
];

const priceRanges = [
  "All Prices",
  "Under $25",
  "$25 - $50",
  "$50 - $100",
  "$100 - $200",
  "Over $200",
];

const ratings = ["All Ratings", "4+ Stars", "4.5+ Stars", "5 Stars"];

export function ProductsFilter() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [selectedRating, setSelectedRating] = useState("All Ratings");

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedPriceRange("All Prices");
    setSelectedRating("All Ratings");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range} className="flex items-center space-x-2">
              <input
                type="radio"
                name="priceRange"
                value={range}
                checked={selectedPriceRange === range}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="rounded"
              />
              <span className="text-sm">{range}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Rating</h3>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label key={rating} className="flex items-center space-x-2">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={selectedRating === rating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="rounded"
              />
              <span className="text-sm">{rating}</span>
            </label>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear Filters
      </Button>
    </div>
  );
}
