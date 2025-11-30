"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import { useBestSellingProducts } from "@/hooks/use-analytics-queries";
import { formatMoney } from "@/utils/money";

export function BestSellingProductsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const { data, isLoading, error } = useBestSellingProducts({ limit });

  console.log("Best Selling Products Data:", data);

  const filteredData = data?.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Failed to load best selling products</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Best Selling Products</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Units Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((product, index) => (
                    <TableRow key={product.productId}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell className="font-medium">{product.productName}</TableCell>
                      <TableCell>{product.category || "Uncategorized"}</TableCell>
                      <TableCell className="text-right">{product.unitsSold}</TableCell>
                      <TableCell className="text-right">{formatMoney(product.revenue)}
                      </TableCell>
                      <TableCell className="text-right">{product.stock || 0}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stock && product.stock > 10
                              ? "default"
                              : product.stock && product.stock > 0
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {product.stock && product.stock > 10
                            ? "In Stock"
                            : product.stock && product.stock > 0
                            ? "Low Stock"
                            : "Out of Stock"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}