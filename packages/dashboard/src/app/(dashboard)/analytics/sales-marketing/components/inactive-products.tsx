"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { AlertTriangle, Eye, EyeOff, Percent, Trash2 } from "lucide-react";
import { useState } from "react";

export function InactiveProducts() {
  // TODO: Fetch real data
  const isLoading = false;
  const [period, setPeriod] = useState("30");

  const inactiveProducts = [
    {
      id: 1,
      name: "Vintage Camera",
      category: "Electronics",
      lastSale: "45 days ago",
      stock: 12,
      price: 15000,
      daysInactive: 45,
    },
    {
      id: 2,
      name: "Classic Headphones",
      category: "Audio",
      lastSale: "62 days ago",
      stock: 8,
      price: 3500,
      daysInactive: 62,
    },
    {
      id: 3,
      name: "Old Model Tablet",
      category: "Electronics",
      lastSale: "78 days ago",
      stock: 5,
      price: 25000,
      daysInactive: 78,
    },
    {
      id: 4,
      name: "Wired Mouse",
      category: "Accessories",
      lastSale: "34 days ago",
      stock: 20,
      price: 800,
      daysInactive: 34,
    },
    {
      id: 5,
      name: "Basic Keyboard",
      category: "Accessories",
      lastSale: "51 days ago",
      stock: 15,
      price: 1200,
      daysInactive: 51,
    },
  ];

  const handleDiscount = (productId: number) => {
    console.log(`Apply discount to product ${productId}`);
    // TODO: Implement discount logic
  };

  const handleHide = (productId: number) => {
    console.log(`Hide product ${productId}`);
    // TODO: Implement hide logic
  };

  const handleDelete = (productId: number) => {
    console.log(`Delete product ${productId}`);
    // TODO: Implement delete logic
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (days: number) => {
    if (days > 60) return "bg-red-100 text-red-800";
    if (days > 45) return "bg-orange-100 text-orange-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <CardTitle>Inactive Products Alert</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Products with no sales in the selected period
            </p>
          </div>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="60">Last 60 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {inactiveProducts.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              No inactive products found in this period
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Inactive Products
                </div>
                <div className="text-2xl font-bold">
                  {inactiveProducts.length}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Tied-up Inventory Value
                </div>
                <div className="text-2xl font-bold">
                  KSh{" "}
                  {inactiveProducts
                    .reduce((sum, p) => sum + p.price * p.stock, 0)
                    .toLocaleString()}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Total Units in Stock
                </div>
                <div className="text-2xl font-bold">
                  {inactiveProducts.reduce((sum, p) => sum + p.stock, 0)}
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Sale</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inactiveProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.lastSale}</TableCell>
                      <TableCell className="text-right">
                        {product.stock}
                      </TableCell>
                      <TableCell className="text-right">
                        KSh {product.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getSeverityColor(product.daysInactive)}
                        >
                          {product.daysInactive} days
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDiscount(product.id)}
                            title="Apply Discount"
                          >
                            <Percent className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleHide(product.id)}
                            title="Hide Product"
                          >
                            <EyeOff className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            title="Delete Product"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Action Recommendations */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 text-blue-900">
                Recommended Actions
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Apply discount promotions to move slow-moving inventory</li>
                <li>• Hide products from storefront to focus on best sellers</li>
                <li>• Consider bundling with popular products</li>
                <li>• Review pricing strategy and market demand</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}