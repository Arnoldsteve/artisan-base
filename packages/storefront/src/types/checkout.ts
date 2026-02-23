import { CartItem } from "./cart";
import { Currency } from "./currency";

/**
 * SOLID Principle: Single Responsibility
 * Defines the contract for a high-scale, multi-vendor checkout process.
 */

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  provider: 'MPESA' | 'STRIPE' | 'PAYPAL' | 'CASH';
}

/**
 * TOP 1% ARCHITECTURE: The Multi-Vendor Payload
 * This structure allows the backend to receive one request but 
 * distribute items to their correct 'Row-Isolated' owners.
 */
export interface CheckoutPayload {
  customer: Customer;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentMethod: string;
  currency: Currency;
  
  // Items are grouped by tenantId before sending
  vendors: {
    tenantId: string;
    items: CartItem[];
    shippingMethodId: string;
  }[];
}

export interface OrderResponse {
  orderIds: string[]; // Returns multiple IDs for multi-vendor checkouts
  paymentReference: string;
  checkoutUrl?: string;
}