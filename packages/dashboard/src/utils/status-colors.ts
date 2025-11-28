import { OrderStatus, PaymentStatus } from "@/types/orders";

const orderStatusColorMap: Record<OrderStatus, string> = {
  PENDING: "#b45309", // yellow-700
  CONFIRMED: "#1d4ed8", // blue-700
  PROCESSING: "#4338ca", // indigo-700
  PACKED: "#7c3aed", // violet-600
  SHIPPED: "#0e7490", // cyan-700
  IN_TRANSIT: "#0891b2", // cyan-600
  OUT_FOR_DELIVERY: "#0d9488", // teal-600
  DELIVERED: "#15803d", // green-700
  PARTIALLY_DELIVERED: "#16a34a", // green-600
  RETURN_REQUESTED: "#ea580c", // orange-600
  RETURNED: "#dc2626", // red-600
  REFUNDED: "#6b7280", // gray-500
  FAILED_DELIVERY: "#b91c1c", // red-700
  CANCELLED: "#991b1b", // red-800
};

const paymentStatusColorMap: Record<PaymentStatus, string> = {
  PENDING: "#b45309", // yellow-700
  PROCESSING: "#4338ca", // indigo-700
  PARTIALLY_PAID: "#c2410c", // orange-700
  PAID: "#15803d", // green-700
  OVERPAID: "#059669", // emerald-600
  FAILED: "#b91c1c", // red-700
  CANCELLED: "#991b1b", // red-800
  REFUNDED: "#6b7280", // gray-500
  PARTIALLY_REFUNDED: "#9ca3af", // gray-400
  CHARGEBACK: "#dc2626", // red-600
  EXPIRED: "#ef4444", // red-500
};

export function getOrderStatusColor(status: OrderStatus): string {
  return orderStatusColorMap[status] || "#374151";
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  return paymentStatusColorMap[status] || "#374151";
}