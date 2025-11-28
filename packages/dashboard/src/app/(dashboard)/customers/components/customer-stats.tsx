"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { DollarSign, Hash, ShoppingBag } from "lucide-react";
import { Decimal } from "decimal.js";
import { formatMoney } from "@/utils/money";
import { Order } from "@/types/orders";


interface CustomerStatsProps {
  orders: Order[];
}

export function CustomerStats({ orders }: CustomerStatsProps) {
  const lifetimeValue = orders.reduce(
    (sum, order) => sum.plus(order.totalAmount),
    new Decimal(0)
  );

  const totalOrders = orders.length;

  const avgOrderValue =
    totalOrders > 0 ? lifetimeValue.dividedBy(totalOrders) : new Decimal(0);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Lifetime Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-muted-foreground mr-3" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Lifetime Value</span>
            <span className="text-lg font-semibold">
              {formatMoney(Number(lifetimeValue))}
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
              {formatMoney(Number(avgOrderValue))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}