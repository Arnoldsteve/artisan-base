"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/hooks/use-products";
import { Category } from "@/types";

export default function CategoriesPage() {
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useCategories();
  // The API returns an array of categories, each with _count.products
  const categories = categoriesResponse || [];
  
  // Log the categories to check the structure=
  console.log("Categories from categories apge:", categories);

  if (categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Product Categories
        </h1>
        <p className="text-muted-foreground">Browse our products by category</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group block bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="aspect-video overflow-hidden rounded-t-lg relative">
                {category.image ? (
                  <Image
                    src={
                      category.image ||
                      `https://picsum.photos/400/400?random=${category.id}`
                    }
                    alt={category.name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
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
      )}
    </div>
  );
}
