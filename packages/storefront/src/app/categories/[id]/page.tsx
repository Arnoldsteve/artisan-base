'use client';

import { notFound, useParams } from "next/navigation";
import CategoryCard from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { Category, Product } from "@/types";
import { useCategory } from "@/hooks/use-categories";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  // 1. You fetch the data. The 'categoryData' variable holds the object you logged.
  const { data: categoryData, isLoading, error } = useCategory(categoryId);

  // --- START: This is how you prepare the data for your JSX ---

  // 2. Handle the loading state
  if (isLoading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }

  // 3. Handle the error or "not found" state
  if (error || !categoryData) {
    notFound();
  }

  // 4. Create the 'category' and 'products' variables that your JSX needs.
  // 'category' is the main data object itself.
  const category = categoryData; 
  // 'products' is the array *inside* that object.
  const products = categoryData.products || [];

  // --- END: Data is ready. Now we render the JSX ---

  // 5. Return your JSX, now uncommented and using the correct variables.
  return (
    <div className="container mx-auto px-4 py-8">
      {/* It now has the 'category' object it needs */}
      <CategoryCard category={category} />
      
      <div className="mt-8">
        {/* It now has the category name from 'category.name' */}
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Products in {category.name}
        </h2>

        {/* It now checks the length of the 'products' array */}
        {products.length === 0 ? (
          <div className="text-muted-foreground">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* It now maps over the 'products' array */}
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}