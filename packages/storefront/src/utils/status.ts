/**
 * Utilities for mapping order and payment statuses to TailwindCSS classes.
 * Keeps status-color logic centralized.
 */

// Order statuses: delivered, shipped, processing, cancelled, etc.
export const getStatusColor = (status?: string): string => {
  if (!status) return "bg-gray-100 text-gray-800";

  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Payment statuses: paid, pending, refunded, failed, etc.
export const getPaymentStatusColor = (status?: string): string => {
  if (!status) return "bg-gray-100 text-gray-800";

  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "refunded":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
