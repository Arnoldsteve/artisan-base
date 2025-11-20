"use client";

import { memo } from "react";
import { ProductCard } from "./product-card";
import { useFeaturedProducts } from "@/hooks/use-products";
import { Button } from "@repo/ui/components/ui/button";
import { ProductsLoading } from "./skeletons/product-card-skeleton";
import Link from "next/link";

export const FeaturedProducts = memo(function FeaturedProducts() {
  const {
    data: featuredResponse,
    isLoading,
    error,
    refetch,
  } = useFeaturedProducts({ limit: 24 });

  const products = featuredResponse?.data ?? [];
  const meta = featuredResponse?.meta;
  const success = featuredResponse?.success;
  const message = featuredResponse?.message;

  // console.log("features products in the landing page", products);

  if (isLoading) {
    return (
      <section className="py-4 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-start mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Featured Products
            </h2>
          </div>
          <ProductsLoading />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-4 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-start mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Featured Products
            </h2>
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
      <section className="py-4 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-start mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Featured Products
            </h2>
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
    <section className="py-4 bg-muted/100">
      <div className="container mx-auto px-2 md:px-4">
        <div className="text-start mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Featured Products
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-start mt-12 flex flex-col sm:flex-row gap-4 ">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/featured">View All Featured Products</Link>
          </Button>
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
});
