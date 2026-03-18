"use client";

import React, { useState } from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/ui/card";

// ⚡ FIX: Import both hooks from the same file
import { useOrders, useOrderDetails } from "@/hooks/use-orders"; 
import { useAuthContext } from "@/contexts/auth-context";
import { OrdersSkeleton } from "@/skeletons/account/orders/orders-skeleton";
import { OrdersEmptyState } from "./orders-empty-state";
import { OrdersList } from "./orders-list";
import { OrderDetailsDialog } from "./order-details-dialog";

export const Orders: React.FC = () => {
  const { user } = useAuthContext();
  const email = user?.email;
  
  // Note: useOrders returns an object with { orders, isLoading, ... }
  const { orders, isLoading, isError } = useOrders(email);
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // ⚡ FIX: Use 'useOrderDetails' as defined in your hooks file
  const { data: selectedOrder, isLoading: loadingOrder } = useOrderDetails(
    selectedOrderId
  );

  if (isLoading) return <OrdersSkeleton />;
  
  return (
    <>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your past orders</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        {isError ? (
          <div className="text-center py-8 text-red-500">
            Failed to load orders. Please try again later.
          </div>
        ) : orders.length === 0 ? (
          <OrdersEmptyState />
        ) : (
          <OrdersList orders={orders} onSelectOrder={setSelectedOrderId} />
        )}
      </CardContent>

      <OrderDetailsDialog
        open={!!selectedOrderId}
        onOpenChange={(open) => !open && setSelectedOrderId(null)}
        order={selectedOrder}
        loading={loadingOrder}
      />
    </>
  );
};