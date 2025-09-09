// src/app/dashboard/orders/components/order-utils.ts
import { OrderStatus, PaymentStatus } from "@/types/orders";

// This file has NO "use client" directive.
// It can be safely imported into both Server and Client Components.

export {
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/utils/status-colors";

export const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-700 border-yellow-500/20";
    case "CONFIRMED":
      return "bg-blue-500/20 text-blue-700 border-blue-500/20";
    case "PROCESSING":
      return "bg-indigo-500/20 text-indigo-700 border-indigo-500/20";
    case "SHIPPED":
      return "bg-cyan-500/20 text-cyan-700 border-cyan-500/20";
    case "DELIVERED":
      return "bg-green-500/20 text-green-700 border-green-500/20";
    case "CANCELLED":
      return "bg-red-500/20 text-red-700 border-red-500/20";
    default:
      return "bg-gray-500/20 text-gray-700 border-gray-500/20";
  }
};

export const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return "bg-green-500/20 text-green-700 border-green-500/20";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-700 border-yellow-500/20";
    case "REFUNDED":
      return "bg-gray-500/20 text-gray-700 border-gray-500/20";
    case "FAILED":
      return "bg-red-500/20 text-red-700 border-red-500/20";
    default:
      return "bg-gray-500/20 text-gray-700 border-gray-500/20";
  }
};
