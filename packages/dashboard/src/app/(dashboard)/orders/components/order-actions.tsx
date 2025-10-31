"use client";

import { useState } from "react";
import { Order, OrderStatus, PaymentStatus } from "@/types/orders";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { toast } from "sonner";
import { UpdateOrderStatusModal } from "../[orderId]/components/update-order-status";

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleUpdateStatus = () => setIsOrderModalOpen(true);
  const handleUpdatePaymentStatus = () => setIsPaymentModalOpen(true);

  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print invoice");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.orderNumber}</title>
        </head>
        <body>
          <h1>Invoice for Order #${order.orderNumber}</h1>
          <p>Customer: ${order.customerName ?? "N/A"}</p>
          <p>Email: ${order.customerEmail ?? "N/A"}</p>
          <p>Total: $${order.total.toFixed(2)}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
    toast.success("Opening print dialog...");
  };

  const handleEditOrder = () => toast.info("Edit order feature coming soon!");
  const handleSendEmail = () => toast.info("Send email feature coming soon!");
  const handleAddInternalNote = () =>
    toast.info("Add internal note feature coming soon!");
  const handleViewActivity = () =>
    toast.info("View activity/timeline feature coming soon!");
  const handleRefundReturn = () =>
    toast.info("Refund/return order feature coming soon!");

  const handleOrderStatusSubmit = (newStatus: OrderStatus) => {
    console.log("Order status updated:", newStatus);
    toast.success(`Order status updated to ${newStatus}`);
  };

  const handlePaymentStatusSubmit = (newStatus: PaymentStatus) => {
    console.log("Payment status updated:", newStatus);
    toast.success(`Payment status updated to ${newStatus}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-start justify-end gap-3">
            <Button size="sm" onClick={handleUpdateStatus}>
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

            <Button size="sm" onClick={handleSendEmail}>
              Send Email
            </Button>

            <Button size="sm" onClick={handleAddInternalNote}>
              Add Internal Note
            </Button>

            <Button size="sm" onClick={handleViewActivity}>
              View Activity/Timeline
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleRefundReturn}
            >
              Refund/Return Order
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Modals */}
      <UpdateOrderStatusModal
        type="order"
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        orderId={order.id}
        currentStatus={order.status}
        onSubmit={handleOrderStatusSubmit}
      />

      <UpdateOrderStatusModal
        type="payment"
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderId={order.id}
        currentStatus={order.paymentStatus}
        onSubmit={handlePaymentStatusSubmit}
      />
    </>
  );
}
