"use client";

import { useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/hooks/use-categories"; // Our infinite hook
import { CategoriesLoading } from "@/components/skeletons/category-card-skeleton";
import { useTenantContext } from "@/contexts/tenant-context";
import { LayoutGrid, ArrowRight } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { InfiniteLoader } from "@/components/shared/infinite-loader";

/**
 * TOP 1% ARCHITECTURE: Context-Aware Infinite Categories List
 * Handled via a single component that adapts to Global or Isolated mode.
 */
export default function CategoryListPage() {
  const { tenant } = useTenantContext();

  // 1. Unified Hook Consumption
  // The 'tenant.id' is automatically picked up inside the hook for isolation
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategories({}, 24);

  // 2. Data Flattening
  // millions of users: flatMap is efficient for merging paginated batches
  const categories = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );


  if (isLoading && categories.length === 0) return <CategoriesLoading />;

  return (
    <section className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Dynamic Header based on context */}
        <div className="flex flex-col gap-2 mb-10">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <LayoutGrid className="size-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Collections
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            {tenant ? `${tenant.name} Categories` : "Global Marketplace"}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {tenant
              ? `Browse specialized collections curated by ${tenant.name}.`
              : "Discover handcrafted treasures across all our artisan communities."}
          </p>
        </div>

        {/* Empty State */}
        {categories.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 border rounded-sm border-dashed">
            <h2 className="text-xl font-semibold mb-2">No categories found</h2>
            <p className="text-muted-foreground text-sm">
              Check back soon for new artisan collections.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category) => {
              // Enterprise Standard: Context-Aware Linking
              const categoryLink = tenant
                ? `/shop/${tenant.subdomain}/categories/${category.slug}`
                : `/categories/${category.slug}`;

              return (
                <Link
                  key={category.id}
                  href={categoryLink}
                  className="group relative flex flex-col bg-card border rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                    <Image
                      src={`https://picsum.photos/seed/${category.id}/600/450`}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    />
                    {/* Count Badge Overlay */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      {category._count?.products || 0} Items
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-4 flex-1">
                      {category.description ||
                        `Explore our unique ${category.name.toLowerCase()} collection.`}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-bold text-blue-600 uppercase tracking-tighter">
                      Browse Collection{" "}
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <InfiniteLoader
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </section>
  );
}
