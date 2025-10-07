"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { ProductFilters as FiltersType } from "@/types"; 

interface ProductFiltersProps {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  sortBy: FiltersType["sortBy"]; 
  setSortBy: (value: FiltersType["sortBy"]) => void;
  priceRange: [number, number]; 
  setPriceRange: (value: [number, number]) => void;
  onApplyPriceFilter: () => void;
  hasUnappliedPriceChanges: boolean;
}

export function ProductFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  onApplyPriceFilter,
  hasUnappliedPriceChanges,
}: ProductFiltersProps) {
  return (
    <div className="bg-card border rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Sort By</label>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as FiltersType["sortBy"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A–Z</SelectItem>
              <SelectItem value="price-low">Price: Low → High</SelectItem>
              <SelectItem value="price-high">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Price Range: Ksh {priceRange[0].toLocaleString()} - Ksh {priceRange[1].toLocaleString()}
          </label>
          <div className="flex space-x-2 mb-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="w-24"
            />
            <span className="self-center">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-24"
            />
          </div>
          
          {/* Apply Button - Only shows when there are unapplied changes */}
          {hasUnappliedPriceChanges && (
            <Button
              onClick={onApplyPriceFilter}
              size="sm"
              className="w-full"
            >
              Apply Price Filter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}