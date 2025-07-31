// File: packages/dasboard/src/app/dashboard/customers/components/customer-stats.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { DollarSign, Hash, ShoppingBag } from "lucide-react";
import { CustomerOrder } from "@/types/customers";
import { Decimal } from "decimal.js";

interface CustomerStatsProps {
  orders: CustomerOrder[]; // <-- THE FIX: Expect an array of CustomerOrder
}

export function CustomerStats({ orders }: CustomerStatsProps) {
  // Use Decimal methods for precise financial calculations
  const lifetimeValue = orders.reduce(
    (sum, order) => sum.plus(order.totalAmount),
    new Decimal(0)
  );

  const totalOrders = orders.length;

  const avgOrderValue =
    totalOrders > 0 ? lifetimeValue.dividedBy(totalOrders) : new Decimal(0);

  // Helper function to format a Decimal value into a currency string
  const formatCurrency = (amount: Decimal) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount.toNumber()); // Convert Decimal to number for formatting

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifetime Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-muted-foreground mr-3" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Lifetime Value</span>
            <span className="text-lg font-semibold">
              {formatCurrency(lifetimeValue)}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <ShoppingBag className="h-5 w-5 text-muted-foreground mr-3" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Orders</span>
            <span className="text-lg font-semibold">{totalOrders}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Hash className="h-5 w-5 text-muted-foreground mr-3" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">
              Avg. Order Value
            </span>
            <span className="text-lg font-semibold">
              {formatCurrency(avgOrderValue)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}