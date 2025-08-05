// C:\Users\Admin\Documents\Arnold\Personal Work\artisan-base\packages\dasboard\src\components\home\RecentOrders.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  AvatarFallback,
  Badge,
} from "@repo/ui";
import { formatCurrency } from "@/utils/format-currency";
import { RecentOrdersResponse } from "@/types/dashboard";

/**
 * A local skeleton component for the recent orders card.
 */
const RecentOrdersSkeleton = () => (
  <Card className="lg:col-span-3">
    <CardHeader>
      <CardTitle>Recent Orders</CardTitle>
      <CardDescription>Loading recent sales...</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
            <Skeleton className="ml-auto h-5 w-[60px]" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * Props for the RecentOrders component.
 * It accepts data and state from the `useRecentOrders` hook.
 */
interface RecentOrdersProps {
  ordersData: RecentOrdersResponse | undefined;
  isLoading: boolean;
  isError: boolean;
}

/**
 * A component that renders the "Recent Orders" card with a table.
 * It handles its own loading and error states.
 */
export function RecentOrders({ ordersData, isLoading, isError }: RecentOrdersProps) {
  // --- Loading State ---
  if (isLoading) {
    return <RecentOrdersSkeleton />;
  }

  // --- Error State ---
  if (isError) {
    return (
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load recent orders.</p>
        </CardContent>
      </Card>
    );
  }

  // --- Success State (with data) ---
  if (ordersData) {
    return (
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Your {ordersData.recentOrders.length} most recent sales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersData.recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {order.customer?.firstName?.[0]}
                          {order.customer?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <p className="font-medium truncate">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {order.customer?.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === "PENDING" ? "outline" : "default"}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  // Fallback for no data, though TanStack Query usually handles this
  return null;
}