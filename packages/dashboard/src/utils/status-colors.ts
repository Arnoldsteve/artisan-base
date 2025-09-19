import { OrderStatus, PaymentStatus } from "@/types/orders";

const orderStatusColorMap: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-700 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/20 text-blue-700 border-blue-500/20",
  PROCESSING: "bg-indigo-500/20 text-indigo-700 border-indigo-500/20",
  SHIPPED: "bg-cyan-500/20 text-cyan-700 border-cyan-500/20",
  DELIVERED: "bg-green-500/20 text-green-700 border-green-500/20",
  CANCELLED: "bg-red-500/20 text-red-700 border-red-500/20",
};

const paymentStatusColorMap: Record<PaymentStatus, string> = {
  PAID: "bg-green-500/20 text-green-700 border-green-500/20",
  PENDING: "bg-yellow-500/20 text-yellow-700 border-yellow-500/20",
  REFUNDED: "bg-gray-500/20 text-gray-700 border-gray-500/20",
  FAILED: "bg-red-500/20 text-red-700 border-red-500/20",
};

/**
 * Gets the color classes for an order status.
 */
export function getOrderStatusColor(status: OrderStatus): string {
  return (
    orderStatusColorMap[status] ||
    "bg-gray-500/20 text-gray-700 border-gray-500/20"
  );
}

/**
 * Gets the color classes for a payment status.
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  return (
    paymentStatusColorMap[status] ||
    "bg-gray-500/20 text-gray-700 border-gray-500/20"
  );
}
