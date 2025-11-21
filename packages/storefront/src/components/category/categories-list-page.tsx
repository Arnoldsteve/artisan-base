"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategories, useInfiniteCategories } from "@/hooks/use-categories";
import { CategoriesLoading } from "@/components/skeletons/category-card-skeleton";
import { useRef, useEffect } from "react";

export default function CategoryListPage() {
  // const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
  //   useInfiniteCategories();

  const { data: response, isLoading, error, refetch } = useCategories();
  const categories = response?.data || [];

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (!loaderRef.current) return;
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
  //         fetchNextPage();
  //       }
  //     },
  //     { rootMargin: "200px", threshold: 0.1 }
  //   );
  //   observer.observe(loaderRef.current);
  //   return () => observer.disconnect();
  // }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isLoading) return <CategoriesLoading />;

  // console.log("data in the category list", data)
  // const categories = data?.pages.flatMap((p) => p?.data) ?? [];
  // console.log("data in the category list", categories)

  return (
    <section className="py-4 bg-muted/100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Product Categories
          </h1>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No categories found
            </h2>
            <p className="text-muted-foreground">
              Categories will appear here once they're added.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group block bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="aspect-video overflow-hidden rounded-t-lg relative">
                    <Image
                      src={
                        category.image ||
                        `https://picsum.photos/400/400?random=${category.id}`
                      }
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 
                            (max-width: 1024px) 33vw, 
                            (max-width: 1280px) 20vw, 
                            16vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category._count?.products || 0} product
                        {category._count?.products !== 1 ? "s" : ""}
                      </span>
                      <span className="text-sm text-primary font-medium">
                        Browse →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Loader for infinite scrolling */}
            {/* <div ref={loaderRef} className="w-full mt-8 text-center">
              {isFetchingNextPage && <CategoriesLoading />}
              {!hasNextPage && categories.length > 0 && (
                <p className="text-sm text-muted-foreground py-4">
                  You've reached the end
                </p>
              )}
            </div> */}
          </>
        )}
      </div>
    </section>
  );
}
