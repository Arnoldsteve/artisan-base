"use client";

import { useState } from "react";
import { OrderStatus, PaymentStatus } from "@/types/orders";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import { UpdateOrderStatusModal } from "../[orderId]/components/update-order-status";

interface OrderActionsProps {
  orderId: string;
  initialStatus: OrderStatus;
  initialPaymentStatus: PaymentStatus;
}

export function OrderActions({
  orderId,
  initialStatus,
  initialPaymentStatus,
}: OrderActionsProps) {
  const [openModal, setOpenModal] = useState<null | "order" | "payment">(null);

  const handleUpdateStatus = () => setOpenModal("order");
  const handleUpdatePaymentStatus = () => setOpenModal("payment");

  const handlePrintInvoice = () => {
    toast.info("Printing invoice feature is not yet implemented.");
  };

  const handleEditOrder = () => {
    toast.info("Edit order feature coming soon!");
  };

  const handleSendEmail = () => {
    console.log("Send email clicked", orderId);
    toast.info("Send email feature coming soon!");
  };

  const handleAddInternalNote = () => {
    console.log("Add internal note clicked", orderId);
    toast.info("Add internal note feature coming soon!");
  };

  const handleViewActivity = () => {
    console.log("View activity clicked", orderId);
    toast.info("View activity/timeline feature coming soon!");
  };

  const handleRefundReturn = () => {
    console.log("Refund/return clicked", orderId);
    toast.info("Refund/return order feature coming soon!");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-start justify-end gap-3">
            <Button variant="outline" size="sm" onClick={handleUpdateStatus}>
              Update Status
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpdatePaymentStatus}
            >
              Update Payment Status
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
              Print Invoice
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditOrder}>
              Edit Order
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendEmail}>
              Send Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddInternalNote}>
              Add Internal Note
            </Button>
            <Button variant="secondary" size="sm" onClick={handleViewActivity}>
              View Activity/Timeline
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRefundReturn}
            >
              Refund/Return Order
            </Button>
          </div>
        </CardContent>
      </Card>

      <UpdateOrderStatusModal
        type={openModal === "order" ? "order" : "payment"}
        isOpen={!!openModal}
        onClose={() => setOpenModal(null)}
        orderId={orderId}
        currentStatus={
          openModal === "order" ? initialStatus : initialPaymentStatus
        }
      />
    </>
  );
}
