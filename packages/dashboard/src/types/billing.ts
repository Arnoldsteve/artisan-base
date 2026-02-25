import { Currency } from "./currency";

/**
 * SOLID Principle: Single Source of Truth
 * Matches the 'SubscriptionStatus' enum in your Prisma schema.
 */
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  UNPAID = 'UNPAID',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

/**
 * Represents a platform-level Pricing Plan
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  features: Record<string, any>; // JSON features from your schema
  providerPlanId?: string;       // Stripe Price ID
}

/**
 * Represents the current Store's subscription record
 */
export interface TenantSubscription {
  id: string;
  tenantId: string;
  status: SubscriptionStatus;
  providerSubscriptionId?: string;
  currentPeriodEnd: string;
  plan?: SubscriptionPlan; // Populated via include
}

/**
 * DTO for the 'Subscribe' action
 * Note: Intelligently handles both M-Pesa (phone) and Stripe (stripePriceId)
 */
export interface CreateSubscriptionDto {
  planId: string;
  billingCycle: BillingCycle;
  stripePriceId?: string; // Required if Currency is USD/GBP/EUR
  phone?: string;         // Required if Currency is KES (M-Pesa)
}

export interface ChangePlanDto {
  newPlanId: string;
  newStripePriceId?: string;
  newAmount?: number;
}

export interface BillingHistoryItem {
  id: string;
  amount: number;
  provider: string;
  status: string;
  createdAt: string;
  metadata?: any;
}