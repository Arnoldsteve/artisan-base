"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@repo/ui/components/ui/button";
import { Filter, SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductFilters } from "./product-filters";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";
import { useCategories } from "@/hooks/use-categories";
import { useTenantContext } from "@/contexts/tenant-context";

export function ProductsContent() {
  const searchParams = useSearchParams();
  const { tenant } = useTenantContext();
  const searchQuery = searchParams.get("search") || "";

  // Filter State
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // 1. Fetch Categories for Filter Dropdown
  const { data: catResponse, isLoading: isLoadingCats } = useCategories();

  // ⚡ FIX: Flatten the pages to get a single array of categories
  const categories = useMemo(() => {
    return catResponse?.pages.flatMap((page) => page.data) ?? [];
  }, [catResponse]);
  
  // 2. Infinite Products Fetch (Context Aware via Hook)
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    fetchNextPage, 
    hasNextPage 
  } = useProducts({
    search: searchQuery,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    minPrice: appliedPriceRange[0],
    maxPrice: appliedPriceRange[1],
    // Handle price sort mapping
    sortBy: sortBy.includes('price') ? 'price' : sortBy as any,
    sortOrder: sortBy === 'price-low' ? 'asc' : 'desc'
  }, 24);

  // 3. Infinite Scroll Intersection Observer
  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!loaderRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { rootMargin: "400px" }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // Derived Data
  const products = data?.pages.flatMap((page) => page.data) ?? [];
  const hasUnappliedPriceChanges = priceRange[0] !== appliedPriceRange[0] || priceRange[1] !== appliedPriceRange[1];

  if (isLoading && products.length === 0) return <ProductsLoading />;

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Title Section: Changes based on Tenant Context */}
        <div className="flex flex-col mb-8 gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {tenant ? `${tenant.name} Products` : "Global Marketplace"}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Displaying {products.length} unique handcrafted items
            </p>
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Filters"}
            </Button>
          </div>
        </div>

        {showFilters && (
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onApplyPriceFilter={() => setAppliedPriceRange(priceRange)}
            hasUnappliedPriceChanges={hasUnappliedPriceChanges}
          />
        )}

        {/* Product Grid */}
        {products.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 border rounded-lg border-dashed">
            <h3 className="text-lg font-medium">No items match your criteria</h3>
            <p className="text-muted-foreground">Try clearing your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Infinite Loading Trigger */}
        <div ref={loaderRef} className="py-12 flex justify-center">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <span>Loading more treasures...</span>
            </div>
          ) : hasNextPage ? (
            <Button variant="ghost" onClick={() => fetchNextPage()}>Load More</Button>
          ) : products.length > 0 && (
            <p className="text-muted-foreground text-sm italic">You've reached the end of the collection.</p>
          )}
        </div>
      </div>
    </section>
  );
}