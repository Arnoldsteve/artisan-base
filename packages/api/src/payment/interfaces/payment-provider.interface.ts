import { PaymentProvider, PaymentStatus } from '@generated/prisma/client';

export interface PaymentInitResult {
  providerTransactionId: string;
  checkoutUrl?: string;        // Stripe
  stkPushRequestId?: string;   // Mpesa
  metadata?: Record<string, any>;
}

export interface PaymentVerifyResult {
  providerTransactionId: string;
  status: PaymentStatus;
  rawPayload?: Record<string, any>;
}

/**
 * Pure Infrastructure Contract.
 * Providers ONLY know how to move money.
 * No orders, no subscriptions, no business logic.
 */
export interface IPaymentProvider {
  getName(): PaymentProvider;
  initialize(params: PaymentInitParams): Promise<PaymentInitResult>;
  verify(providerTransactionId: string): Promise<PaymentVerifyResult>;
  handleWebhook(payload: Record<string, any>, signature?: string): Promise<PaymentVerifyResult>;
}

export interface PaymentInitParams {
  amount: number;
  currency: string;
  phone?: string;           // Mpesa
  returnUrl?: string;       // Stripe
  description?: string;
  reference: string;        // Your internal reference (orderId or subscriptionId)
  metadata?: Record<string, any>;
}