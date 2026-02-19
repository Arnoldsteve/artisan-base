import { Currency } from '@generated/prisma/client';

/**
 * Billing Event Payloads.
 * Emitted by BillingService and BillingSchedulerService.
 * Consumed by notification layer (email/sms) — fully decoupled.
 */

export const BILLING_EVENTS = {
  SUBSCRIPTION_CREATED:  'billing.subscription_created',
  SUBSCRIPTION_RENEWED:  'billing.subscription_renewed',
  SUBSCRIPTION_CANCELED: 'billing.subscription_canceled',
  SUBSCRIPTION_PAST_DUE: 'billing.subscription_past_due',
  PLAN_CHANGED:          'billing.plan_changed',
  EXPIRY_REMINDER:       'billing.expiry_reminder',
  TENANT_SUSPENDED:      'billing.tenant_suspended',
  TENANT_REACTIVATED:    'billing.tenant_reactivated',
} as const;

export type BillingEventKey = keyof typeof BILLING_EVENTS;

// ─── Event Payloads ───────────────────────────────────────────────────────────

export interface SubscriptionCreatedEvent {
  tenantId: string;
  tenantName: string;
  ownerEmail: string;
  ownerFirstName: string;
  planId: string;
  billingMode: 'AUTOMATED' | 'MANUAL';
  currency: Currency;
  currentPeriodEnd: Date;
  checkoutUrl?: string;       // Stripe — redirect to this
  stkPushRequestId?: string;  // Mpesa — STK push sent
}

export interface SubscriptionRenewedEvent {
  tenantId: string;
  tenantName: string;
  ownerEmail: string;
  planId: string;
  currency: Currency;
  currentPeriodEnd: Date;
}

export interface SubscriptionCanceledEvent {
  tenantId: string;
  tenantName: string;
  ownerEmail: string;
  canceledAt: Date;
  immediately: boolean;
}

export interface SubscriptionPastDueEvent {
  tenantId: string;
  tenantName: string;
  ownerEmail: string;
  currency: Currency;
  currentPeriodEnd: Date;
}

export interface PlanChangedEvent {
  tenantId: string;
  tenantName: string;
  ownerEmail: string;
  oldPlanId: string;
  newPlanId: string;
  currency: Currency;
}

export interface ExpiryReminderEvent {
  tenantId: string;
  tenantName: string;
  ownerEmail: string;
  ownerFirstName: string;
  currency: Currency;
  currentPeriodEnd: Date;
  daysLeft: number;           // 7, 3, or 1
}

export interface TenantSuspendedEvent {
  tenantId: string;
  tenantName: string;
  currentPeriodEnd: Date;
}

export interface TenantReactivatedEvent {
  tenantId: string;
  tenantName: string;
  ownerEmail: string;
  newPeriodEnd: Date;
}