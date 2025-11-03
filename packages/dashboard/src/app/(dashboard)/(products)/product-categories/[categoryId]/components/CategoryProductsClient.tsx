"use client";

import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { Category } from "@/types/categories";
import { ProductsView } from "@/app/(dashboard)/products/components/products-view";
import { PaginatedResponse } from "@/types/shared";
import { Product } from "@/types/products";
import { Card } from "@repo/ui/components/ui/card";

interface CategoryProductsClientProps {
  category: Category | null;
  initialProductData: PaginatedResponse<Product>;
}

export default function CategoryProductsClient({
  category,
  initialProductData,
}: CategoryProductsClientProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
          {category?.description && (
            <p className="text-gray-600 mt-1">{category.description}</p>
          )}
      </Card>
      
      <div>
        <Link href="/product-categories">
          <Button variant="outline">Back to Categories</Button>
        </Link>
      </div>

      <ProductsView initialProductData={initialProductData} />
    </div>
  );
}