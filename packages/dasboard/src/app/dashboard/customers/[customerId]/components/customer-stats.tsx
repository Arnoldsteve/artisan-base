// src/app/dashboard/customers/[customerId]/components/customer-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { DollarSign, Hash, ShoppingBag } from "lucide-react";
import { Order } from "@/types/orders";

interface CustomerStatsProps {
  orders: Order[]; // It will receive the list of this customer's orders
}

export function CustomerStats({ orders }: CustomerStatsProps) {
  const totalOrders = orders.length;
  const lifetimeValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = totalOrders > 0 ? lifetimeValue / totalOrders : 0;
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <Card>
        <CardHeader><CardTitle>Lifetime Stats</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-muted-foreground mr-3" />
                <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Lifetime Value</span>
                    <span className="text-lg font-semibold">{formatCurrency(lifetimeValue)}</span>
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
                    <span className="text-sm text-muted-foreground">Avg. Order Value</span>
                    <span className="text-lg font-semibold">{formatCurrency(avgOrderValue)}</span>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}