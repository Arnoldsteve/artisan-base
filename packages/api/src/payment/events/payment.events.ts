/**
 * Payment Event Constants & Payloads.
 * Emitted by PaymentService.
 * Consumed by OrderModule, BillingModule listeners.
 */

import { PaymentStatus } from "@generated/prisma/client";

export const PAYMENT_EVENTS = {
  PAYMENT_UPDATED: 'payment.updated',
  PAYMENT_INITIATED: 'payment.initiated',
} as const;

export interface PaymentUpdatedEvent {
  tenantId: string;
  paymentId: string;
  reference: string;
  status: PaymentStatus;
  rawPayload?: Record<string, any>;
}

export interface PaymentInitiatedEvent {
  tenantId: string;
  paymentId: string;
  provider: string;
  amount: number;
  currency: string;
  reference: string;
}