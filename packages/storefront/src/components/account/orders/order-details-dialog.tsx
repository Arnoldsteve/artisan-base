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
import { Separator } from "@repo/ui/components/ui/separator";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { 
  CalendarDays, 
  Package, 
  MapPin, 
  CreditCard,
  ShoppingBag,
  Truck
} from "lucide-react";
import { formatMoney } from "@/lib/money";
import { getStatusColor } from "@/utils/status";
import { OrderDetailsSkeleton } from "@/skeletons/account/orders/order-details-skeleton";

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5" />
            Order Details
          </DialogTitle>
          <DialogDescription className="text-base font-medium text-foreground">
            {order?.orderNumber || order?.id}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12">
            <OrderDetailsSkeleton />
          </div>
        ) : order ? (
          <div className="space-y-6 py-4">
            {/* Order Info Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Date */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-medium">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={`${getStatusColor(order.status)} mt-1`}>
                        {order.status?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Order Items</h3>
                  <span className="text-sm text-muted-foreground">
                    ({order.items?.length || 0} items)
                  </span>
                </div>
                
                <div className="space-y-3">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × {formatMoney(item.unitPrice, order.currency)}
                        </p>
                      </div>
                      <div className="font-semibold">
                        {formatMoney(item.unitPrice * item.quantity, order.currency)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />
                
                {/* Order Total */}
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <span className="font-semibold text-lg">Total Amount</span>
                  <span className="font-bold text-lg text-primary">
                    {formatMoney(order.totalAmount, order.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Addresses Card */}
            {(order.shippingAddress || order.billingAddress) && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <Truck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <h3 className="font-semibold">Shipping Address</h3>
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed p-3 bg-muted/30 rounded-lg">
                          {Object.values(order.shippingAddress)
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </div>
                    )}

                    {/* Billing Address */}
                    {order.billingAddress && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="font-semibold">Billing Address</h3>
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed p-3 bg-muted/30 rounded-lg">
                          {Object.values(order.billingAddress)
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.print()}
              >
                Print Order
              </Button>
              <DialogClose asChild>
                <Button className="flex-1">
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Order not found
            </p>
            <p className="text-sm text-muted-foreground">
              The order you're looking for doesn't exist or has been removed.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};