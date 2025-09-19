"use client";

import { OrderStatus, PaymentStatus } from "@/types/orders";
import { Button } from "@repo/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { toast } from "sonner";

/**
 * Props for OrderActions component.
 */
interface OrderActionsProps {
  orderId: string;
  initialStatus: OrderStatus;
  initialPaymentStatus: PaymentStatus;
  onUpdateStatusClick: () => void;
  onUpdatePaymentStatusClick?: () => void;
}

/**
 * OrderActions is a presentational component for order-related actions.
 */
export function OrderActions({
  orderId,
  onUpdateStatusClick,
  onUpdatePaymentStatusClick,
}: OrderActionsProps) {
  const handlePrintInvoice = () => {
    toast.info("Printing invoice feature is not yet implemented.");
    // In a real app, this might open a new window:
    // window.open(`/dashboard/orders/${orderId}/invoice`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button onClick={onUpdateStatusClick}>Update Status</Button>
        {onUpdatePaymentStatusClick && (
          <Button variant="outline" onClick={onUpdatePaymentStatusClick}>
            Update Payment Status
          </Button>
        )}
        <Button variant="outline" onClick={handlePrintInvoice}>
          Print Invoice
        </Button>
      </CardContent>
    </Card>
  );
}
