import { Decimal } from "decimal.js";
import { Currency } from "./currency";
import { Product } from "./products";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "PACKED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "PARTIALLY_DELIVERED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "REFUNDED"
  | "FAILED_DELIVERY";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "OVERPAID"
  | "CANCELLED"
  | "PARTIALLY_PAID"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "FAILED"
  | "EXPIRED"
  | "CHARGEBACK";

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
  product: Product | null;
  quantity: number;
  unitPrice: Decimal;
  image: { url: string } | null;
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
  phoneNumber?: string;
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
  currency: Currency;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface UpdatePaymentStatusDto {
  paymentStatus: PaymentStatus;
}
