"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription
} from "@repo/ui/components/ui/sheet";
import { ShopFilters } from "./shop-filters";
import { ShopFilterState } from "@/types/shop-filters";
import { Badge } from "@repo/ui/components/ui/badge";

interface ShopContentProps {
  children: React.ReactNode;
  onSearch: (term: string) => void;
  onApplyFilters: (filters: ShopFilterState) => void;
}

const INITIAL_FILTERS: ShopFilterState = {
  categories: [],
  priceRange: [0, 100000],
  minRating: null
};

export function ShopContent({ children, onSearch, onApplyFilters }: ShopContentProps) {
  const [tempFilters, setTempFilters] = useState<ShopFilterState>(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<ShopFilterState>(INITIAL_FILTERS);
  const [isOpen, setIsOpen] = useState(false);

  // Mock categories
  const mockCategories = [
    { id: "living", name: "Living Room", count: 12 },
    { id: "bedroom", name: "Bedroom", count: 8 },
    { id: "office", name: "Office", count: 5 },
  ];

  const activeFilterCount = tempFilters.categories.length + (tempFilters.minRating ? 1 : 0);

  const handleApply = () => {
    setAppliedFilters(tempFilters);
    onApplyFilters(tempFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    onApplyFilters(INITIAL_FILTERS);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between sticky top-4 z-10 bg-[#fafafa]/90 backdrop-blur-md py-2 transition-all">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search in this shop..." 
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative ml-4 h-11 rounded-xl font-bold gap-2 border-slate-200 hover:bg-white shadow-sm transition-all active:scale-95">
              <SlidersHorizontal className="w-4 h-4" /> 
              Filters
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-blue-600">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px] sm:w-[420px] p-0 border-l border-slate-100 shadow-2xl">
            <div className="flex flex-col h-full bg-white">
              <div className="bg-slate-900 text-white p-8">
                <SheetHeader className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                        <SlidersHorizontal className="w-5 h-5 text-white" />
                    </div>
                    <SheetTitle className="text-white text-xl font-black uppercase tracking-tight">Refine Results</SheetTitle>
                  </div>
                  <SheetDescription className="text-slate-400 font-medium mt-1">
                    Narrow down products from this artisan.
                  </SheetDescription>
                </SheetHeader>
              </div>

              <div className="flex-1 overflow-y-auto px-8">
                 <ShopFilters 
                    categories={mockCategories} 
                    filters={tempFilters}
                    setFilters={setTempFilters}
                 />
              </div>

              <div className="p-6 border-t bg-slate-50 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 font-bold text-slate-500 border-slate-200 h-12"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button 
                  className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 shadow-lg shadow-black/10"
                  onClick={handleApply}
                >
                  Apply {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {children}
    </div>
  );
}