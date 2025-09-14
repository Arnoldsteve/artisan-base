export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  region?: string;
  zipCode: string;
  country: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
}

export interface PaymentMethod {
  id: string;
  code: string; 
  // type: "credit_card" | "paypal" | "bank_transfer";
  type: string;
  name: string;
  icon?: string;
}

import type { CartItem } from "./cart";

export interface Order {
  id: string;
  customer: Customer;
  shippingAddress: ShippingAddress;
  shippingOption: ShippingOption;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: Date;
  estimatedDelivery: Date;
}

export interface CheckoutContextType {
  currentStep: number;
  customer: Customer | null;
  shippingAddress: ShippingAddress | null;
  selectedShippingOption: ShippingOption | null;
  selectedPaymentMethod: PaymentMethod | null;
  order: Order | null;
  isLoading: boolean;
  error: string | null;

  setCustomer: (customer: Customer) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setShippingOption: (option: ShippingOption) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  submitOrder: () => Promise<void>;
  resetCheckout: () => void;
}
