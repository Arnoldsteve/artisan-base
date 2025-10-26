"use client";

import { Badge } from "@repo/ui/components/ui/badge";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { getStatusColor } from "@/utils/status";
import { formatMoney } from "@/lib/money";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Package,
  Calendar,
  ShoppingBag,
  Receipt,
  ChevronRight,
  Eye,
  Truck,
} from "lucide-react";
import { formatDate } from "@/utils/date";

interface OrdersListProps {
  orders: any[];
  onSelectOrder: (id: string) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  onSelectOrder,
}) => {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground">
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "confirmed" || lowerStatus === "delivered")
      return "default";
    if (lowerStatus === "pending" || lowerStatus === "processing")
      return "secondary";
    if (lowerStatus === "shipped") return "outline";
    if (lowerStatus === "cancelled") return "destructive";
    return "secondary";
  };

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <Card
          key={order.id}
          className="group rounde-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/20"
          onClick={() => onSelectOrder(order.id)}
        >
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="p-4 pb-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {order.orderNumber || order.id}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={getStatusVariant(order.status)}
                    className={`${getStatusColor(order.status)} font-medium`}
                  >
                    {order.status?.toUpperCase()}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>

              {/* Items Summary */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Package className="h-3 w-3" />
                <span>
                  {order.items?.length || 0}{" "}
                  {(order.items?.length || 0) === 1 ? "item" : "items"}
                </span>
              </div>
            </div>

            {/* Items Detail - Collapsible Preview */}
            <div className="px-4">
              <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                {order.items
                  ?.slice(0, 2)
                  .map((item: any, itemIndex: number) => (
                    <div
                      key={itemIndex}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {item.quantity}×
                          </span>{" "}
                          {item.productName}
                        </span>
                      </div>
                      <span className="font-medium">
                        {formatMoney(
                          item.unitPrice * item.quantity,
                          order.currency
                        )}
                      </span>
                    </div>
                  ))}

                {(order.items?.length || 0) > 2 && (
                  <div className="text-xs text-muted-foreground pt-1 border-t border-muted-foreground/20">
                    +{(order.items?.length || 0) - 2} more items
                  </div>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  {/* subtital */}
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span>SubTotal:</span>
                    <span>{formatMoney(order.subtotal, order.currency)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span>Shipping:</span>
                    </div>
                    <div>
                      {formatMoney(order.shippingAmount, order.currency)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span>Tax:</span>
                    </div>
                    <div>{formatMoney(order.taxAmount, order.currency)}</div>
                  </div>

                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span>Total:</span>
                    <span>
                      {formatMoney(order.totalAmount, order.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-3" />

            <div className="p-3 pt-0">
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOrder(order.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {orders.length >= 10 && (
        <div className="text-center py-4">
          <Button variant="outline" size="sm">
            Load More Orders
          </Button>
        </div>
      )}
    </div>
  );
};
