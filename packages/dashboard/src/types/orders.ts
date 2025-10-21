import { Decimal } from 'decimal.js';

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED";

export interface OrderCustomer {
  id: string; 
  firstName: string | null;
  lastName: string | null;
  email: string;
}


export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: Decimal; 
  image: {url: string} | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: Decimal; 
  subtotal: Decimal;    
  shippingAmount: Decimal; 
  taxAmount: Decimal;      
  createdAt: string; 
  customer: OrderCustomer | null;
  items: OrderItem[];
}

export interface ManualOrderItemDto {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CustomerDetailsDto {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
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
  shippingAmount?: number; 
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface UpdatePaymentStatusDto {
  paymentStatus: PaymentStatus;
}