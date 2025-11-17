"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { CategoriesLoading } from "./skeletons/category-card-skeleton";
import { useCategories } from "@/hooks/use-categories";

export const CategoryShowcase = memo(function CategoryShowcase() {
  const { data: response, isLoading, error, refetch } = useCategories();
  const categories = response?.data || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-start mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Shop by Category
            </h2>
          </div>
          <CategoriesLoading />
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
              Shop by Category
            </h2>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Unable to load categories. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories.length) {
    return (
      <section className="py-4 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-start mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Shop by Category
            </h2>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No categories available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 bg-[#f4f4f4]">
      <div className="container mx-auto px-4">
        <div className="text-start mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {categories.slice(0, 12).map((category: any) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block"
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={
                      category.image ||
                      `https://picsum.photos/400/400?random=${category.id}`
                    }
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                </div>

                {/* Content section stretches evenly */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>

                  {/* Spacer pushes button to bottom */}
                  <div className="flex-1" />

                  {category.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-auto truncate text-ellipsis whitespace-nowrap"
                    title={`Explore ${category.name}`} 
                  >
                    Explore {category.name}
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-start mt-12">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/categories">View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
});
