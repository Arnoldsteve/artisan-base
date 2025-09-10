// File: packages/dasboard/src/types/orders.ts

import { Decimal } from 'decimal.js';

// ============================================================================
// Main Entity Types & Enums (Data received from the API)
// ============================================================================

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED";

/**
 * Simplified Customer type for embedding in an Order.
 */
export interface OrderCustomer {
  id: string; // It's good practice to include the ID
  firstName: string | null;
  lastName: string | null;
  email: string;
}

/**
 * Detailed Order Item type for order details.
 */
export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: Decimal; // <-- CORRECT TYPE: Monetary values should be Decimal
  image: string | null;
}

/**
 * The main Order type, representing the data structure returned from the API.
 */
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: Decimal; // <-- CORRECT TYPE
  subtotal: Decimal;    // <-- CORRECT TYPE
  shippingAmount: Decimal; // <-- CORRECT TYPE
  taxAmount: Decimal;      // <-- CORRECT TYPE
  createdAt: string; // ISO date string
  customer: OrderCustomer | null;
  items: OrderItem[];
}

// ============================================================================
// Data Transfer Objects (DTOs) (Data sent to the API)
// ============================================================================

export interface ManualOrderItemDto {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CustomerDetailsDto {
  email: string;
  firstName: string;
  lastName?: string;
}

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

export interface CreateOrderDto {
  customer: CustomerDetailsDto;
  shippingAddress: AddressDto;
  billingAddress?: AddressDto;
  items: ManualOrderItemDto[];
  shippingAmount?: number; // `number` is correct for sending JSON
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface UpdatePaymentStatusDto {
  paymentStatus: PaymentStatus;
}