"use client";
// REFACTOR: Featured products component with proper separation of concerns and performance optimizations

import { memo } from "react";
import { ProductCard } from "./product-card";
import { useFeaturedProducts } from "@/hooks/use-products";
import { Button } from "@repo/ui/components/ui/button";
import { Loader2 } from "lucide-react";

// OPTIMIZATION: Memoized component to prevent unnecessary re-renders
export const FeaturedProducts = memo(function FeaturedProducts() {
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useFeaturedProducts(6);


  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular handcrafted items, carefully selected
              for their quality, beauty, and craftsmanship.
            </p>
          </div>

          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular handcrafted items, carefully selected
              for their quality, beauty, and craftsmanship.
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Unable to load featured products. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular handcrafted items, carefully selected
              for their quality, beauty, and craftsmanship.
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No featured products available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular handcrafted items, carefully selected for
            their quality, beauty, and craftsmanship.
          </p>
        </div>

        {/* OPTIMIZATION: Grid layout with responsive design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <a href="/products">View All Products</a>
          </Button>
        </div>
      </div>
    </section>
  );
});
