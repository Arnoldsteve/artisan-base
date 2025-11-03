"use client";

import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Category } from "@/types/categories";
import { Product } from "@/types/products";
import { ProductsView } from "@/app/(dashboard)/products/components/products-view";

interface CategoryProductsClientProps {
  category: Category | null;
  products: Product[];
  totalProducts: number;
  searchQuery: string;
  categoryId: string;
}

export default function CategoryProductsClient({
  category,
  products,
  searchQuery,
  categoryId,
}: CategoryProductsClientProps) {
  console.log("category", category);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {category?.description && (
            <p className="text-gray-600 mt-1">{category.description}</p>
          )}
        </div>
      </div>
      <div>
        <Link href="/product-categories">
          <Button variant="outline">Back to Categories</Button>
        </Link>
      </div>

      {/* Products Table */}
      {products.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-xs truncate"
                        title={product.description}
                      >
                        {product.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {Number(product.price).toLocaleString("en-KE", {
                          style: "currency",
                          currency: "KES",
                        })}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {product.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/products/${product.id}`}>View</Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href={`/products/${product.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchQuery
                ? `No products found matching "${searchQuery}"`
                : "No products found in this category"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
