// src/types/orders.ts

// These enums must match your generated prisma types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

// This matches the OrderItemDto class in your backend
export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

// This matches the CreateOrderDto class in your backend
export interface CreateOrderDto {
  items: CreateOrderItemDto[];
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
}

// This matches the UpdateOrderDto class in your backend
export interface UpdateOrderStatusDto {
    status: OrderStatus;
}

// This matches the UpdatePaymentStatusDto class in your backend
export interface UpdatePaymentStatusDto {
    paymentStatus: PaymentStatus;
}


// You should also have your main Order type here for responses
export interface Order {
    items: any[];
    id: string;
    orderNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    // ... add all other fields that your API returns for an order
}