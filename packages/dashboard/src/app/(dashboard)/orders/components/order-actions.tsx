"use client";

import { OrderStatus, PaymentStatus } from "@/types/orders";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { toast } from "sonner";

interface OrderActionsProps {
  orderId: string;
  initialStatus: OrderStatus;
  initialPaymentStatus: PaymentStatus;
}

export function OrderActions({ orderId }: OrderActionsProps) {
  const handleUpdateStatus = () => {
    console.log("Update status clicked", orderId);
    toast.info("Update status feature coming soon!");
  };

  const handleUpdatePaymentStatus = () => {
    console.log("Update payment status clicked", orderId);
    toast.info("Update payment status feature coming soon!");
  };

  const handlePrintInvoice = () => {
    toast.info("Printing invoice feature is not yet implemented.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button onClick={handleUpdateStatus}>Update Status</Button>
        <Button variant="outline" onClick={handleUpdatePaymentStatus}>
          Update Payment Status
        </Button>
        <Button variant="outline" onClick={handlePrintInvoice}>
          Print Invoice
        </Button>
      </CardContent>
    </Card>
  );
}
