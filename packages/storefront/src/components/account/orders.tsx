import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Package } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { useOrders } from "@/hooks/use-orders";
import { useAuthContext } from "@/contexts/auth-context";

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const Orders: React.FC = () => {
  const { user } = useAuthContext();
  const email = user?.email;
  const { data: orders = [], isLoading, error } = useOrders(email);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your past orders</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading orders...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load orders.
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No orders yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start shopping to see your order history here
            </p>
            <Button>Browse Products</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {order.orderNumber || order.id}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status?.charAt(0).toUpperCase() +
                        order.status?.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.productName}
                      </span>
                      <span>
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
