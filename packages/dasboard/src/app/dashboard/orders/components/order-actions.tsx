"use client";

import { Button } from "@repo/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { toast } from "sonner";

// This is now a "dumb" component. It just receives functions to call.
interface OrderActionsProps {
  orderId: string;
  onUpdateStatusClick: () => void;
}

export function OrderActions({
  orderId,
  onUpdateStatusClick,
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
        <Button variant="outline" onClick={handlePrintInvoice}>
          Print Invoice
        </Button>
      </CardContent>
    </Card>
  );
}
