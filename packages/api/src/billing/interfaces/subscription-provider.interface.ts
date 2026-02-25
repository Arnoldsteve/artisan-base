import { Currency } from "@generated/prisma/client";

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID';
export type BillingMode = 'AUTOMATED' | 'MANUAL';

export interface CreateSubscriptionParams {
  tenantId: string;
  planId: string;
  stripePriceId?: string;       // Stripe — price ID from Stripe dashboard
  amount: number;
  currency: Currency;
  phone?: string;               // Mpesa — tenant's phone number
  billingCycle: 'MONTHLY' | 'YEARLY';
  metadata?: Record<string, any>;
}

export interface SubscriptionResult {
  providerSubscriptionId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  checkoutUrl?: string;         // Stripe — redirect tenant here to enter card
  stkPushRequestId?: string;    // Mpesa — STK push sent to phone
  metadata?: Record<string, any>;
}

export interface CancelSubscriptionParams {
  providerSubscriptionId: string;
  immediately?: boolean;        // true = cancel now, false = cancel at period end
}

export interface ChangePlanParams {
  providerSubscriptionId: string;
  newStripePriceId?: string;    // Stripe only
  newAmount?: number;           // Mpesa — new plan amount
  newPlanId: string;
}

export interface SubscriptionWebhookResult {
  providerSubscriptionId: string;
  status: SubscriptionStatus;
  currentPeriodEnd?: Date;
  rawPayload?: Record<string, any>;
}

/**
 * Contract every subscription provider must fulfill.
 * Stripe = automated. Mpesa = manual.
 * BillingService calls these — never directly from controller.
 */
export interface ISubscriptionProvider {
  getBillingMode(): BillingMode;
  create(params: CreateSubscriptionParams): Promise<SubscriptionResult>;
  cancel(params: CancelSubscriptionParams): Promise<void>;
  changePlan(params: ChangePlanParams): Promise<SubscriptionResult>;
  handleWebhook(
    payload: Record<string, any>,
    signature?: string,
  ): Promise<SubscriptionWebhookResult>;
}