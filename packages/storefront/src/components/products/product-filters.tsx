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
import { ProductFilters as FiltersType, SortField } from "@/types/product"; 

interface ProductFiltersProps {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  sortBy: string; 
  setSortBy: (value: any) => void;
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
    <div className="bg-card border rounded-sm p-4 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Filter */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="rounded-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By Filter */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
            Sort Results
          </label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="rounded-sm">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
            Price (KES)
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="h-9 rounded-sm"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="h-9 rounded-sm"
            />
            {hasUnappliedPriceChanges && (
              <Button onClick={onApplyPriceFilter} size="sm" className="h-9 rounded-sm">
                Apply
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}