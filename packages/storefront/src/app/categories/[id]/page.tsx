'use client';

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react"; 

import CategoryCard from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/hooks/use-categories";
import { Category, Product } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const { data: categoryData, isLoading, error } = useCategory(categoryId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Skeleton for CategoryCard */}
          <div className="mb-8 p-6 border rounded-lg">
            <div className="h-64 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
          </div>
          {/* Skeleton for Products Section */}
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create 3 skeleton product cards */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}