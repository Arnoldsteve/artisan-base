export type BillingCycle = "MONTHLY" | "YEARLY";

export interface PlanFeatures {
  productLimit: number | 'unlimited';
  teamMemberLimit: number | 'unlimited';
  hasAnalytics: boolean;
  hasCustomDomain: boolean;
  prioritySupport?: boolean;
  advancedReporting?: boolean;
  dedicatedAccountManager?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  billingCycle: BillingCycle;
  features: PlanFeatures;
  createdAt: string;
}

export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "PAST_DUE" | "UNPAID";

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  currentPeriodStart: string;
  plan: Plan; 
}

export type InvoiceStatus = "PAID" | "DUE" | "FAILED" | "UNPAID" | "CANCELLED";

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: InvoiceStatus;
  invoicePdfUrl?: string; 
}


/**
 * A generic interface for a standardized API response.
 * @template T The type of the data payload.
 */
export interface ApiResponse<T> {
  data: T;
}

// Specific response types for each billing endpoint
export type GetPlansResponse = ApiResponse<Plan[]>;
export type GetSubscriptionResponse = ApiResponse<Subscription>;
export type GetInvoicesResponse = ApiResponse<Invoice[]>;
export type ChangePlanResponse = ApiResponse<{ success: boolean; message: string; }>;
