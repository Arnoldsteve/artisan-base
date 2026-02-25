"use client";

import { useEffect, useRef, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";
import { useInfiniteFeaturedProducts } from "@/hooks/use-products";
import { Button } from "@repo/ui/components/ui/button";
import { Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import { useTenantContext } from "@/contexts/tenant-context";
import Link from "next/link";

/**
 * SOLID Principle: Single Responsibility
 * This page orchestrates the discovery of 'curated' products.
 * Handles both Global Marketplace and Isolated Storefront contexts.
 */
export default function FeaturedPage() {
  const { tenant } = useTenantContext();
  
  // 1. Infinite Data Fetching
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    fetchNextPage, 
    hasNextPage,
    isError 
  } = useInfiniteFeaturedProducts(24);

  // 2. Data Flattening (O(n) performance)
  const products = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  // 3. Optimized Intersection Observer
  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!loaderRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { rootMargin: "400px" } // Load before the user hits the bottom
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isLoading && products.length === 0) return <ProductsLoading />;

  // Dynamic Routing Logic
  const allProductsLink = tenant ? `/shop/${tenant.subdomain}/products` : "/products";

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-12">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Sparkles className="size-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Curated</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            {tenant ? `Featured by ${tenant.name}` : "Global Featured Treasures"}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {tenant 
              ? `The very best handcrafted excellence from the ${tenant.name} collection.`
              : "Discover the most exceptional handcrafted pieces from artisans across the globe."}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border rounded-sm border-dashed bg-muted/5">
            <div className="p-4 bg-muted rounded-full mb-4">
              <ShoppingBag className="size-8 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No featured items yet
            </h2>
            <p className="text-muted-foreground text-sm">
              Check back soon as we curate new arrivals.
            </p>
          </div>
        ) : (
          <>
            {/* Optimized Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite Loader */}
            <div ref={loaderRef} className="py-20 flex justify-center">
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-blue-600 animate-pulse font-bold text-sm uppercase tracking-tighter">
                   Unveiling more masterpieces...
                </div>
              ) : hasNextPage ? (
                <Button variant="outline" onClick={() => fetchNextPage()}>Load More</Button>
              ) : (
                <div className="h-px w-full max-w-xs bg-border relative">
                   <span className="absolute inset-x-0 -top-2 text-center text-[10px] uppercase font-bold text-muted-foreground bg-background px-2 w-fit mx-auto">
                    End of Selection
                   </span>
                </div>
              )}
            </div>

            {/* Global/Store Discovery CTA */}
            <div className="mt-12 group">
              <Link href={allProductsLink}>
                <div className="bg-muted/30 rounded-sm p-10 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-foreground">
                      Explore the Full Collection
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Browse through every unique piece available in the {tenant ? tenant.name : 'Marketplace'}.
                    </p>
                  </div>
                  <Button className="min-w-[200px] h-12 font-bold uppercase tracking-widest gap-2">
                    View All Products <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}