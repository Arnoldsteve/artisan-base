"use client";

import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { Category } from "@/types/categories";
import { ProductsWrapper } from "@/app/(dashboard)/products/components/products-wrapper";
import { PaginatedResponse } from "@/types/shared";
import { Product } from "@/types/products";
import { Card } from "@repo/ui/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

interface CategoryProductsClientProps {
  category: Category | null;
  initialProductData: PaginatedResponse<Product>;
}

export default function CategoryProductsClient({
  category,
  initialProductData,
}: CategoryProductsClientProps) {
  return (
    <>
      <PageHeader title={category?.name ?? "Category"}>
        <Link href="/product-categories">
          <Button variant={"outline"} size={"sm"}>
            Categories List
          </Button>
        </Link>
      </PageHeader>

      <Card className="p-6">
        {category?.description && (
          <p className="text-gray-600 mt-1">{category.description}</p>
        )}
      </Card>

      <ProductsWrapper initialProductData={initialProductData} />
    </>
  );
}
