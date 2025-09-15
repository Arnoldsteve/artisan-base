import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/ui/card";

import { useOrders } from "@/hooks/use-orders";
import { useAuthContext } from "@/contexts/auth-context";
import { useOrder } from "@/hooks/use-order";
import { OrdersSkeleton } from "@/skeletons/account/orders/orders-skeleton";
import { OrdersEmptyState } from "./orders-empty-state";
import { OrdersList } from "./orders-list";
import { OrderDetailsDialog } from "./order-details-dialog";

export const Orders: React.FC = () => {
  const { user } = useAuthContext();
  const email = user?.email;
  const { data: orders = [], isLoading, error } = useOrders(email);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { data: selectedOrder, isLoading: loadingOrder } = useOrder(
    selectedOrderId,
    email
  );

  if (isLoading) return <OrdersSkeleton />;
  console.log("Orders component loaded", orders);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your past orders</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        {error ? (
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

    </Card>
  );
};
