"use client";

import { Badge } from "@repo/ui/components/ui/badge";
import { getStatusColor } from "@/utils/status";
import { formatMoney } from "@/lib/money";

interface OrdersListProps {
  orders: any[];
  onSelectOrder: (id: string) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({ orders, onSelectOrder }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <button
          key={order.id}
          className="w-full text-left border rounded-lg p-4 hover:bg-accent transition cursor-pointer"
          onClick={() => onSelectOrder(order.id)}
          aria-label={`View details for order ${order.orderNumber || order.id}`}
        >
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
                {formatMoney(order.totalAmount, order.currency)}
              </p>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
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
                  {formatMoney(item.unitPrice * item.quantity, order.currency)}
                </span>
              </div>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
};
