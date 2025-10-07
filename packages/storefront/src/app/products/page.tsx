"use client";

//@ts-ignore
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

import { Filter, Grid, List } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/use-products";
import { Product, ProductFilters as ProductFilterType } from "@/types";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";
import { ProductFilters } from "@/components/products/product-filters";

// Products content component
function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] =
    useState<NonNullable<ProductFilterType["sortBy"]>>("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 100000]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories from API
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useCategories();
  const categories = categoriesResponse || [];

  // Fetch products from API with filters
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useProducts({
    search: searchQuery,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy,
    // You can add pagination here if needed
  });

  const products = (productsResponse as any) ?? [];

  // console.log("productsResponse:", productsResponse);
  console.log("Products response:", products);

  if (isLoading || isLoadingCategories) {
    return <ProductsLoading />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error loading products
          </h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-4 bg-[#f4f4f4]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : "All Products"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {products.length} product
              {products.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

         {/* Filters Section */}
        {showFilters && (
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={(value) => {
              if (value !== undefined) setSortBy(value);
            }}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h2>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2"
                : "space-y-4"
            }
          >
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
