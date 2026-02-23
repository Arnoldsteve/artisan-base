"use client";

import { memo } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { LayoutGrid, ArrowRight } from "lucide-react";
import { useTopCategories } from "@/hooks/use-categories";
import { CategoriesLoading } from "./skeletons/category-card-skeleton";
import { useTenantContext } from "@/contexts/tenant-context";
import CategoryCard from "./category-card";

/**
 * TOP 1% ARCHITECTURE: Hybrid Category Showcase
 * Automatically switches between 'Marketplace Collections' and 'Store Collections'
 * based on the active URL context.
 */
export const CategoryShowcase = memo(function CategoryShowcase() {
  const { tenant } = useTenantContext();

  // 1. PERFORMANCE: Fetch only the top 12 categories for the home page.
  // millions of users: This uses a long staleTime (1 hour) to reduce DB load.
  const { 
    data: categories, 
    isLoading, 
    isError, 
    refetch 
  } = useTopCategories(12);

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
          <CategoriesLoading />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center border-y bg-muted/5">
        <p className="text-muted-foreground mb-4 font-medium">
          We couldn't load the collections right now.
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Retry Loading
        </Button>
      </div>
    );
  }

  if (!categories?.length) return null;

  // Enterprise Standard: Dynamic routing for the "View All" link
  const viewAllLink = tenant 
    ? `/shop/${tenant.subdomain}/categories` 
    : "/categories";

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
              <LayoutGrid className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Discover
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {tenant ? "Shop by Collection" : "Global Marketplace"}
            </h2>
          </div>
          
          <Link 
            href={viewAllLink} 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all"
          >
            Explore All <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Grid Section: Reusing the Refactored CategoryCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              variant="default" 
            />
          ))}
        </div>

        {/* Mobile View All Action */}
        <div className="mt-12 md:hidden">
          <Button asChild variant="outline" className="w-full h-12 font-bold uppercase tracking-widest">
            <Link href={viewAllLink}>View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
});