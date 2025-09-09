"use client";

import { useState } from "react";
import { Order, OrderStatus, PaymentStatus } from "@/types/orders";
import { OrderActions } from "./order-actions";
import { OrderSummaryCard } from "./order-summary-card";
import { UpdateStatusDialog } from "./update-status-dialog";
import { toast } from "sonner";
import { orderService } from "@/services/order-service";

interface OrderSidebarProps {
  initialOrder: Order;
}

/**
 * OrderSidebar manages order status and payment status updates.
 */
export function OrderSidebar({ initialOrder }: OrderSidebarProps) {
  // This component holds the state for the order data it displays
  const [order, setOrder] = useState<Order>(initialOrder);

  // State for the dialog
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isStatusUpdatePending, setIsStatusUpdatePending] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status
  );
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentStatus>(order.paymentStatus);

  const handleSaveStatus = async () => {
    setIsStatusUpdatePending(true);
    try {
      const updatedOrder = await orderService.updateStatus(
        order.id,
        selectedStatus
      );
      setOrder(updatedOrder);
      toast.success(`Order status updated to ${selectedStatus}.`);
    } catch (error) {
      toast.error((error as Error).message || "Failed to update order status.");
    }
    setIsStatusUpdatePending(false);
    setIsStatusDialogOpen(false);
  };

  const handleSavePaymentStatus = async () => {
    setIsPaymentPending(true);
    try {
      const updatedOrder = await orderService.updatePaymentStatus(
        order.id,
        selectedPaymentStatus
      );
      setOrder(updatedOrder);
      toast.success(`Payment status updated to ${selectedPaymentStatus}.`);
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to update payment status."
      );
    }
    setIsPaymentPending(false);
  };

  return (
    <div className="space-y-6">
      {/* The OrderActions component receives the handler to open the dialog */}
      <OrderActions
        orderId={order.id}
        onUpdateStatusClick={() => setIsStatusDialogOpen(true)}
      />

      {/* The summary card receives the stateful 'order' object */}
      <OrderSummaryCard order={order} />

      {/* The dialog is also controlled by state within this component */}
      <UpdateStatusDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        currentStatus={order.status}
        onStatusChange={setSelectedStatus}
        onSave={handleSaveStatus}
        isPending={isStatusUpdatePending}
      />

      {/* Payment status update UI (simple select + button) */}
      <div className="flex items-center gap-2">
        <select
          value={selectedPaymentStatus}
          onChange={(e) =>
            setSelectedPaymentStatus(e.target.value as PaymentStatus)
          }
          className="border rounded px-2 py-1"
        >
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="REFUNDED">Refunded</option>
          <option value="FAILED">Failed</option>
        </select>
        <button
          onClick={handleSavePaymentStatus}
          disabled={isPaymentPending}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isPaymentPending ? "Saving..." : "Update Payment Status"}
        </button>
      </div>
    </div>
  );
}
