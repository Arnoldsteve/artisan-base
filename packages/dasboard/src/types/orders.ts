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
 * DTO for a single line item in the order (matches API ManualOrderItemDto)
 */
export interface ManualOrderItemDto {
  productId: string;
  variantId?: string;
  quantity: number;
}

/**
 * DTO for customer details (matches API CustomerDetailsDto)
 */
export interface CustomerDetailsDto {
  email: string;
  firstName: string;
  lastName?: string;
}

/**
 * DTO for address (matches API AddressDto)
 */
export interface AddressDto {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * DTO for creating an order (matches API CreateManualOrderDto)
 */
export interface CreateOrderDto {
  customer: CustomerDetailsDto;
  shippingAddress: AddressDto;
  billingAddress?: AddressDto;
  items: ManualOrderItemDto[];
  shippingAmount?: number;
  notes?: string;
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
