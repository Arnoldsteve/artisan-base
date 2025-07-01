// src/types/orders.ts

/**
 * Possible order statuses.
 */
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

/**
 * Possible payment statuses.
 */
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED";

/**
 * DTO for creating an order item.
 */
export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

/**
 * DTO for creating an order.
 */
export interface CreateOrderDto {
  items: CreateOrderItemDto[];
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
}

/**
 * DTO for updating order status.
 */
export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

/**
 * DTO for updating payment status.
 */
export interface UpdatePaymentStatusDto {
  paymentStatus: PaymentStatus;
}

/**
 * Customer type for orders.
 */
export interface OrderCustomer {
  firstName?: string;
  lastName?: string;
  email: string;
}

/**
 * Order item type for order details.
 */
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

/**
 * Main Order type for responses.
 */
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  createdAt: string;
  customer?: OrderCustomer;
  items: OrderItem[];
}
