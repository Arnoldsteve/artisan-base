"use client";
// REFACTOR: Category showcase component with performance optimizations

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/hooks/use-products";
import { Button } from "@repo/ui/components/ui/button";
import { Loader2 } from "lucide-react";
import { CategoriesLoading } from "./skeletons/category-card-skeleton";

// OPTIMIZATION: Memoized component to prevent unnecessary re-renders
export const CategoryShowcase = memo(function CategoryShowcase() {
  const { data: categories = [], isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-start mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-sm">
              Explore our curated collections of handcrafted products
            </p>
          </div>
          <CategoriesLoading />
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
            <p className="text-muted-foreground">
              Explore our curated collections of handcrafted products
            </p>
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
        <div className="flex justify-between">
          <div className="text-start mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-sm">
              Explore our curated collections of handcrafted products
            </p>
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>

        {/* OPTIMIZATION: Grid layout with responsive design */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group block"
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
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
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <Button variant="outline" size="sm" className="w-full">
                    Explore {category.name}
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/categories">View All Categories</Link>
          </Button>
        </div> */}
      </div>
    </section>
  );
});
