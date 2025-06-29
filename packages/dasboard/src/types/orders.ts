// src/types/orders.ts

// Enums from your schema. These are great for type safety.
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

// A simplified Customer type for embedding in the Order object.
// In a real app, this would come from a JOIN query.
export interface OrderCustomer {
  firstName: string | null;
  lastName: string | null;
  email: string;
}

// New type for an item within an order
export interface OrderItem {
  id: string;
  productName: string;
  variantName?: string;
  sku?: string;
  image?: string;
  quantity: number;
  unitPrice: number;
}

// New type for a structured address
export interface Address {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

// Update the main Order type
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  customer: OrderCustomer | null;
  createdAt: string;
  
  // Add the new, detailed fields
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
}