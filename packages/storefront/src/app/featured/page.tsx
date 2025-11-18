"use client";

import { ProductCard } from "@/components/product-card";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";
import { useInfiniteFeaturedProducts } from "@/hooks/use-products";
import { Button } from "@repo/ui/components/ui/button";
import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

export default function FeaturedPage() {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteFeaturedProducts({ limit: 36 });

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    console.log("data in the feateured product list", data)

  const products = data?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) return <ProductsLoading />;

  return (
    <section className="py-4 bg-muted/100">
      <div className="container mx-auto px-2 md:px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">
              {products.length} featured product
              {products.length !== 1 ? "s" : ""} found
            </h1>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No featured products available
            </h2>
            <p className="text-muted-foreground">
              Check back soon for our latest featured items.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 px-0 gap-2">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div ref={loaderRef} className="w-full mt-8">
              {isFetchingNextPage ? (
                <ProductsLoading />
              ) : hasNextPage ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Scroll for more products
                </p>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  You've reached the end
                </p>
              )}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-start">
              <div className="bg-[#fff] rounded-lg p-8">
                <h3 className="text-xl font-semibold text-foreground mb-0">
                  Want to see more?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Explore our complete collection of handcrafted products
                </p>
                <a href="/products">
                  <Button> Browse All Products</Button>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
