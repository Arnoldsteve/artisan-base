"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import CategoryCard from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/hooks/use-categories";
import { Category, Product } from "@/types";
import { CategoriesLoading } from "@/components/skeletons/category-card-skeleton";


interface CategoryDetailsPageProps {
    initialCategory?: Category
}
export default function CategoryDetailsPage({ initialCategory }: CategoryDetailsPageProps) {
  const params = useParams<{ slug: string}>();
  const categoryId = params.slug;

  const { data: categoryData, isLoading, error } = useCategory(categoryId, {
    initialData: initialCategory
  });

  if (isLoading) return <CategoriesLoading />;

  if (error || !categoryData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Category Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The category you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/categories">
            <Button className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Categories</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const category = categoryData;
  const products = categoryData.products || [];

  return (
    <section className="py-4 bg-muted/100">
      <div className="container mx-auto px-4 py-8">
        <CategoryCard category={category} />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Products in {category.name}
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                There are currently no products in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
