"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@repo/ui/components/ui/button";
import { Filter } from "lucide-react";
import { useInfiniteProducts, useCategories } from "@/hooks/use-products";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";
import { Product, ProductFilters as ProductFilterType } from "@/types";

export function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [sortBy, setSortBy] = useState<ProductFilterType["sortBy"]>("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 100000]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([
    1, 100000,
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Load categories
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useCategories();
  const categories = categoriesResponse || [];

  // 🔥 Infinite Products Fetch
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteProducts({
      search: searchQuery,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      minPrice: appliedPriceRange[0],
      maxPrice: appliedPriceRange[1],
      sortBy,
      limit: 50,
    });

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Auto-load next page when scrolling to bottom
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage]);

  const hasUnappliedPriceChanges =
    priceRange[0] !== appliedPriceRange[0] ||
    priceRange[1] !== appliedPriceRange[1];

  const handleApplyPriceFilter = () => {
    setAppliedPriceRange(priceRange);
  };

  if (isLoading || isLoadingCategories) {
    return <ProductsLoading />;
  }

  // Flatten all pages
  const products = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <section className="py-4 bg-muted/50">
      <div className="container mx-auto px-2 md:px-4 py-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <p className="text-2xl font-bold">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onApplyPriceFilter={handleApplyPriceFilter}
            hasUnappliedPriceChanges={hasUnappliedPriceChanges}
          />
        )}

        {/* No Results */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">No products found</h2>
            <p className="text-muted-foreground">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite Scroll Loader */}
            <div
              ref={loaderRef}
              className="text-center py-8 col-span-full text-muted-foreground"
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                  ? "Scroll to load more..."
                  : "No more products"}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
