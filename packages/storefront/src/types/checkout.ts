import { CartItem } from "./cart";
import { Currency } from "./currency";

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * TOP 1% ARCHITECTURE: Standardized ISO Address
 * We remove firstName/lastName here because they are already 
 * provided in the 'Customer' object of the payload.
 */
export interface ShippingAddress {
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
  provider: string; 
}

export interface CheckoutPayload {
  customer: Customer;
  shippingAddress: ShippingAddress;
  paymentProvider: string; 
  currency: Currency;
  vendors: {
    tenantId: string;
    items: { productId: string; quantity: number }[];
    shippingMethodId: string;
  }[];
}

export interface OrderResponse {
  orderIds: string[];
  paymentReference: string;
  checkoutUrl?: string;
}