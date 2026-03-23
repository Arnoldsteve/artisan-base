"use client";

import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Separator } from "@repo/ui/components/ui/separator";
import { Slider } from "@repo/ui/components/ui/slider"; 
import { Star } from "lucide-react";
import { ShopFilterState } from "@/types/shop-filters";
import { cn } from "@repo/ui/lib/utils";

interface ShopFiltersProps {
  categories: { id: string; name: string; count: number }[];
  filters: ShopFilterState;
  setFilters: React.Dispatch<React.SetStateAction<ShopFilterState>>;
}

export function ShopFilters({ categories, filters, setFilters }: ShopFiltersProps) {
  
  const toggleCategory = (id: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter(c => c !== id)
        : [...prev.categories, id]
    }));
  };

  return (
    <div className="space-y-8 py-6">
      {/* 1. Category Filter */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Collections</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
              onClick={() => toggleCategory(cat.id)}
            >
              <div className="flex items-center gap-3">
                <Checkbox 
                  id={cat.id} 
                  checked={filters.categories.includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                />
                <Label className="text-sm font-bold text-slate-700 cursor-pointer group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </Label>
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-white border px-2 py-0.5 rounded-md shadow-sm">
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* 2. Price Range Filter */}
      <div className="space-y-5">
        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Price Range</h4>
        <div className="px-2">
            <Slider 
              value={filters.priceRange} 
              max={100000} 
              step={1000} 
              onValueChange={(val) => setFilters(prev => ({ ...prev, priceRange: val as [number, number] }))}
              className="mb-6" 
            />
            <div className="flex justify-between items-center">
                <div className="bg-slate-50 border rounded-lg px-3 py-1.5 flex flex-col">
                  <span className="text-[8px] uppercase font-bold text-slate-400">Min</span>
                  <span className="text-xs font-black text-slate-900">KES {filters.priceRange[0].toLocaleString()}</span>
                </div>
                <div className="h-px w-4 bg-slate-200" />
                <div className="bg-slate-50 border rounded-lg px-3 py-1.5 flex flex-col text-right">
                  <span className="text-[8px] uppercase font-bold text-slate-400">Max</span>
                  <span className="text-xs font-black text-slate-900">KES {filters.priceRange[1].toLocaleString()}</span>
                </div>
            </div>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* 3. Ratings Filter */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((rating) => (
            <div 
              key={rating} 
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg border-2 border-transparent transition-all cursor-pointer group",
                filters.minRating === rating ? "bg-blue-50 border-blue-100" : "hover:bg-slate-50"
              )}
              onClick={() => setFilters(prev => ({ ...prev, minRating: prev.minRating === rating ? null : rating }))}
            >
               <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
               </div>
               <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">
                 {rating}.0 & up
               </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}