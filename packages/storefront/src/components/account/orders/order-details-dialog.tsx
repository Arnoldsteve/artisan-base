"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@repo/ui/components/ui/dialog";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { formatMoney } from "@/lib/money";
import { getStatusColor } from "@/utils/status";
import { OrderDetailsSkeleton } from "@/skeletons/orders/order-details-skeleton";
// import { formatMoney } from "@/lib/money-helpers"; // your currency helper
// import { getStatusColor } from "@/utils/status"; // central status color util

type OrderDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  loading: boolean;
};

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  onOpenChange,
  order,
  loading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            {order?.orderNumber || order?.id}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            <OrderDetailsSkeleton />
          </div>
        ) : order ? (
          <div className="space-y-4">
            {/* Order Date */}
            <div className="flex justify-between">
              <span className="font-medium">Order Date:</span>
              <span>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : ""}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
            </Badge>
            </div>

            {/* Total */}
            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span>{formatMoney(order.totalAmount, order.currency)}</span>
            </div>

            {/* Items */}
            <div>
              <span className="font-medium">Items:</span>
              <div className="mt-2 space-y-2">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.productName}
                    </span>
                    <span>
                      {formatMoney(
                        item.unitPrice * item.quantity,
                        order.currency
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div>
                <span className="font-medium">Shipping Address:</span>
                <div className="text-sm mt-1">
                  {Object.values(order.shippingAddress).join(", ")}
                </div>
              </div>
            )}

            {/* Billing Address */}
            {order.billingAddress && (
              <div>
                <span className="font-medium">Billing Address:</span>
                <div className="text-sm mt-1">
                  {Object.values(order.billingAddress).join(", ")}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Order not found.
          </div>
        )}

        <DialogClose asChild>
          <Button className="mt-4 w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};