"use client";

import { useEffect, useRef, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";
import { useInfiniteNewArrivals } from "@/hooks/use-products";
import { Button } from "@repo/ui/components/ui/button";
import { Clock, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { useTenantContext } from "@/contexts/tenant-context";
import Link from "next/link";

/**
 * SOLID Principle: Single Responsibility
 * This page focuses on the 'Freshness' of the marketplace.
 * Uses Infinite Scroll to handle high-volume daily uploads.
 */
export default function NewArrivalsPage() {
  const { tenant } = useTenantContext();

  // 1. Fetch Infinite Data
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    fetchNextPage, 
    hasNextPage 
  } = useInfiniteNewArrivals(24);

  // 2. Data Flattening
  const products = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  // 3. Intersection Observer for Infinite Scroll
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

  if (isLoading && products.length === 0) return <ProductsLoading />;

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-12">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Clock className="size-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Just In</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            {tenant ? `${tenant.name} New Arrivals` : "Global New Arrivals"}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {tenant 
              ? `The latest handcrafted pieces recently added to the ${tenant.name} store.`
              : "Discover the newest arrivals from artisan communities across Kenya and beyond."}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-32 border rounded-sm border-dashed">
            <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No new items found</h2>
            <p className="text-muted-foreground">Check back later for fresh collections.</p>
          </div>
        ) : (
          <>
            {/* Optimized Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite Loader Trigger */}
            <div ref={loaderRef} className="py-20 flex justify-center">
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                   <span className="text-sm font-bold uppercase tracking-tighter">Loading fresh goods...</span>
                </div>
              ) : hasNextPage ? (
                <Button variant="outline" onClick={() => fetchNextPage()}>Load More</Button>
              ) : (
                <p className="text-muted-foreground text-xs italic uppercase tracking-widest">You've seen everything for now</p>
              )}
            </div>

            {/* Platform Trust / Info Section (Scale Factor) */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-16">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full"><Clock className="h-6 w-6 text-primary" /></div>
                <h4 className="font-bold text-lg">Daily Updates</h4>
                <p className="text-sm text-muted-foreground">Fresh handcrafted treasures added to the platform every single day.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full"><TrendingUp className="h-6 w-6 text-primary" /></div>
                <h4 className="font-bold text-lg">Trending Styles</h4>
                <p className="text-sm text-muted-foreground">Discover what's hot in the artisan world right now across Africa.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full"><Sparkles className="h-6 w-6 text-primary" /></div>
                <h4 className="font-bold text-lg">Verified Quality</h4>
                <p className="text-sm text-muted-foreground">Every piece is vetted to ensure authentic artisan craftsmanship.</p>
              </div>
            </div>

            {/* Context-Aware Newsletter / CTA */}
            <div className="mt-16 bg-muted/30 rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-border">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-2xl font-bold">Never Miss a Drop</h3>
                <p className="text-muted-foreground">Subscribe to get notified when {tenant ? tenant.name : 'new artisans'} join the platform.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="default" className="font-bold uppercase tracking-widest px-8">Subscribe</Button>
                <Link href="/products">
                  <Button variant="outline" className="font-bold uppercase tracking-widest gap-2">
                    Shop All <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}