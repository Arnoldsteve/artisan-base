import { PaymentProvider, PaymentStatus, PaymentType } from '@generated/prisma/client';

/**
 * TOP 1% ARCHITECTURE: Fulfillment Strategy
 * REDIRECT: User must be sent to a URL (PayPal, Stripe, Bank Portal).
 * PUSH: User receives a prompt on their device (M-Pesa STK, USSD).
 * MANUAL: Handled offline or via bank transfer instructions.
 */
export enum PaymentFulfillmentType {
  REDIRECT = 'REDIRECT',
  PUSH = 'PUSH',
  MANUAL = 'MANUAL',
}

export interface PaymentInitResult {
  providerTransactionId: string;
  checkoutUrl?: string;        // Used for REDIRECT types
  stkPushRequestId?: string;   // Used for PUSH types
  metadata?: Record<string, any>;
}

export interface PaymentVerifyResult {
  providerTransactionId: string;
  status: PaymentStatus;
  rawPayload?: Record<string, any>;
}

/**
 * Pure Infrastructure Contract.
 * Standardized for Millions of Users and Multi-Vendor scaling.
 */
export interface IPaymentProvider {
  /**
   * Returns the unique name (e.g. MPESA, PAYPAL)
   */
  getName(): PaymentProvider;

  /**
   * ✅ NEW: Returns the fulfillment strategy (SYNC/REDIRECT vs ASYNC/PUSH)
   * This is the 'Key' that solves the redirection dilemma.
   */
  getFulfillmentType(): PaymentFulfillmentType;

  /**
   * Moves the money. 
   * Context (Orders/Billing) is abstracted away into 'reference'.
   */
  initialize(params: PaymentInitParams): Promise<PaymentInitResult>;

  /**
   * Synchronous check for status.
   */
  verify(providerTransactionId: string): Promise<PaymentVerifyResult>;

  /**
   * Inbound verification logic for webhooks.
   */
  handleWebhook(payload: Record<string, any>, signature?: string): Promise<PaymentVerifyResult>;
}

export interface PaymentInitParams {
  amount: number;
  currency: string;
  phone?: string;           // M-Pesa specific
  returnUrl?: string;       // Stripe/PayPal specific
  description?: string;
  reference: string;        // Internal Platform Reference (PAY-xxx)
  metadata?: Record<string, any>;
}

export interface InitiatePaymentParams {
  type: PaymentType; 
  orderId?: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  phone?: string;
  returnUrl?: string;
  description?: string;
  reference: string; // Internal 'PAY-...' reference
  metadata?: Record<string, any>;
}