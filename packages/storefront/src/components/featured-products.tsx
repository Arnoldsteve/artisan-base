"use client";

import { memo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, PackageSearch } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { useFeaturedProducts } from "@/hooks/use-products";
import { ProductsLoading } from "./skeletons/product-card-skeleton";
import { ProductCard } from "./product-card";
import { useTenantContext } from "@/contexts/tenant-context";

/**
 * TOP 1% ARCHITECTURE: Context-Aware Featured Products
 * 
 * Responsibility: Displays a curated list of high-value items.
 * millions of users: Automatically toggles between 'Global Artisan Picks' 
 * and 'Store Highlights' based on the tenant context.
 */
export const FeaturedProducts = memo(function FeaturedProducts() {
  const { tenant } = useTenantContext();

  // 1. PERFORMANCE: Scoped fetch for featured items.
  // The hook automatically injects x-tenant-id via the API client.
  const {
    data: featuredResponse,
    isLoading,
    isError,
    refetch,
  } = useFeaturedProducts({ limit: 12 });

  console.log("featured products", featuredResponse)
  
  const products = featuredResponse?.data ?? [];

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
          <ProductsLoading />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center border-y bg-muted/5">
        <p className="text-muted-foreground mb-4 font-medium">
          Unable to synchronize featured items.
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="font-bold">
          Retry Connection
        </Button>
      </div>
    );
  }

  // Handle Empty State: Important for 1M users where a new store might have no featured tags yet.
  if (!products.length) return null;

  // Enterprise Standard: Link to the full specialized collection
  const featuredLink = tenant 
    ? `/shop/${tenant.subdomain}/products` // Or a specific /featured route if you build it
    : "/products";

  return (
    <section className="py-12 bg-white/50">
      <div className="container mx-auto px-4">
        
        {/* Header Section: Matches CategoryShowcase Style */}
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
              <Sparkles className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Curated
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {tenant ? "Featured Creations" : "Artisan Spotlights"}
            </h2>
          </div>
          
          <Link 
            href={featuredLink} 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all"
          >
            Browse Catalog <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* High-Performance Grid: Optimized for millions of potential rows */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Action */}
        <div className="mt-12 md:hidden space-y-3">
          <Button asChild className="w-full h-12 bg-slate-900 font-bold uppercase tracking-widest">
            <Link href={featuredLink}>View Catalog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
});