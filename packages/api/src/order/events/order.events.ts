import { Currency, OrderStatus, PaymentStatus, PaymentProvider } from '@generated/prisma/client';

/**
 * Order Event Keys.
 * Emitted by OrderService during checkout or manual management.
 * Consumed by BullMQ workers for Emails, M-Pesa STK, and Analytics.
 */
export const ORDER_EVENTS = {
  CHECKOUT_COMPLETED: 'order.checkout_completed', // The global multi-vendor event
  ORDER_CREATED:      'order.created',            // Single store isolated event
  STATUS_UPDATED:     'order.status_updated',
  PAYMENT_UPDATED:    'order.payment_updated',
  ORDER_CANCELLED:    'order.cancelled',
  ITEM_ADDED:         'order.item_added',
} as const;

export type OrderEventKey = keyof typeof ORDER_EVENTS;

// ─── Event Payloads ───────────────────────────────────────────────────────────

/**
 * Global Marketplace Event.
 * millions of users: Used to send ONE receipt to the customer 
 * and initialize the global payment gateway.
 */
export interface CheckoutCompletedEvent {
  orderIds: string[];         // All orders created in this transaction
  paymentReference: string;   // The PAY-xxx reference
  paymentProvider: PaymentProvider;
  customerId: string;
  customerEmail: string;
  totalAmount: number;        // Grand total across all vendors
  currency: Currency;
  tenantIds: string[];        // All merchants involved
}

/**
 * Isolated Tenant Event.
 * millions of users: Used to notify a specific artisan that they 
 * have a new sale in their dashboard.
 */
export interface OrderCreatedEvent {
  orderId: string;
  orderNumber: string;
  tenantId: string;
  customerId: string;
  totalAmount: number;
  currency: Currency;
  itemsCount: number;
}

export interface OrderStatusUpdatedEvent {
  orderId: string;
  tenantId: string;
  oldStatus: OrderStatus;
  newStatus: OrderStatus;
  customerEmail: string;
}

export interface OrderPaymentUpdatedEvent {
  orderId: string;
  tenantId: string;
  paymentReference: string;
  oldStatus: PaymentStatus;
  newStatus: PaymentStatus;
}

export interface OrderCancelledEvent {
  orderId: string;
  tenantId: string;
  reason?: string;
  cancelledAt: Date;
}