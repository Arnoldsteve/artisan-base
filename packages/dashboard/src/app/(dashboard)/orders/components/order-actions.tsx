"use client";

import ReactDOMServer from "react-dom/server";
import { useState } from "react";
import { Order, OrderStatus, PaymentStatus } from "@/types/orders";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { toast } from "sonner";
import { UpdateOrderStatusModal } from "../[orderId]/components/update-order-status";
import { InvoiceDocument } from "../[orderId]/components/invoice-document";

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleUpdateStatus = () => setIsOrderModalOpen(true);
  const handleUpdatePaymentStatus = () => setIsPaymentModalOpen(true);

  const handlePrintInvoice = () => {
    try {
      // Render invoice as HTML string
      const invoiceHTML = ReactDOMServer.renderToString(
        <InvoiceDocument order={order} />
      );

      // Collect existing CSS from the page (Tailwind styles, etc.)
      const styles = Array.from(
        document.querySelectorAll('link[rel="stylesheet"], style')
      )
        .map((node) => node.outerHTML)
        .join("\n");

      // Create print window
      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (!printWindow) {
        toast.error("Please allow popups to print invoice");
        return;
      }

      // Write content into print window
      printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.orderNumber}</title>
          ${styles}
          <style>
            @media print {
              body { margin: 1.5rem; }
            }
          </style>
        </head>
        <body>
          ${invoiceHTML}
        </body>
      </html>
    `);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };

      toast.success("Opening print dialog...");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate invoice for printing.");
    }
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
      <Card className="shadow-none">
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
