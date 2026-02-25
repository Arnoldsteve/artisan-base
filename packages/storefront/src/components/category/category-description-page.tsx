"use client";

import { useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

import CategoryCard from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { useCategory } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products"; // Reusing the powerful infinite hook
import { Category } from "@/types/category";
import { CategoriesLoading } from "@/components/skeletons/category-card-skeleton";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";

interface CategoryDetailsPageProps {
  initialCategory: Category;
}

export default function CategoryDetailsPage({ initialCategory }: CategoryDetailsPageProps) {
  const params = useParams<{ slug: string }>();
  const categorySlug = params.slug;

  // 1. Sync Category Details
  const { data: category, isLoading: isCatLoading } = useCategory(categorySlug, {
    initialData: initialCategory,
  });

  // 2. Fetch Products for THIS Category (Infinite Scroll)
  // TOP 1% LOGIC: We pass the categoryId to our existing products hook.
  // This automatically handles Tenant Isolation if we are in a /shop/ route.
  const {
    data: productsData,
    isLoading: isProductsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProducts({ category: initialCategory.id }, 20);

  // 3. Flatten products from infinite pages
  const allProducts = useMemo(
    () => productsData?.pages.flatMap((page) => page.data) ?? [],
    [productsData]
  );

  // 4. Infinite Scroll Observer
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

  if (isCatLoading && !category) return <CategoriesLoading />;

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/categories">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              All Collections
            </Button>
          </Link>
        </div>

        {/* Category Information Header */}
        <CategoryCard category={category || initialCategory} variant="hero" />

        <div className="mt-16">
          <div className="flex items-center gap-2 mb-8">
            <LayoutGrid className="size-5 text-blue-600" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Products in this Collection
            </h2>
          </div>

          {allProducts.length === 0 && !isProductsLoading ? (
            <div className="text-center py-20 border rounded-sm border-dashed">
              <p className="text-muted-foreground">
                No products have been added to this collection yet.
              </p>
            </div>
          ) : (
            <>
              {/* Reuse the same high-performance grid from your products page */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {allProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Infinite Loader */}
              <div ref={loaderRef} className="py-12 flex flex-col items-center justify-center">
                {isFetchingNextPage ? (
                  <div className="animate-pulse text-sm text-muted-foreground font-medium">
                    Loading more artisan goods...
                  </div>
                ) : hasNextPage ? (
                  <Button variant="outline" onClick={() => fetchNextPage()}>Load More</Button>
                ) : allProducts.length > 0 && (
                  <p className="text-xs text-muted-foreground italic">You've reached the end of this collection.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}