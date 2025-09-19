// ==================================
// ||      Core Data Models      ||
// ==================================
// These interfaces represent the actual data entities.

export type BillingCycle = "MONTHLY" | "YEARLY";

/**
 * Defines the structure for the 'features' JSON object on a Plan.
 * This provides much better type safety than a simple `string[]`.
 */
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
  // NOTE: Prisma's Decimal type is serialized as a string in JSON.
  // The frontend should parse this to a number for calculations.
  price: string;
  billingCycle: BillingCycle;
  features: PlanFeatures;
  // NOTE: This will be sent as an ISO string from the server.
  createdAt: string;
}

export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "PAST_DUE" | "UNPAID";

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  // NOTE: Dates are sent as ISO strings from the server.
  currentPeriodEnd: string;
  currentPeriodStart: string;
  plan: Plan; // The full plan object is nested here.
}

export type InvoiceStatus = "PAID" | "DUE" | "FAILED" | "UNPAID" | "CANCELLED";

export interface Invoice {
  id: string;
  // NOTE: Dates are sent as ISO strings from the server.
  date: string;
  // NOTE: Prisma's Decimal type is serialized as a string.
  amount: string;
  status: InvoiceStatus;
  // It's good practice to include a URL for the user to view/download.
  invoicePdfUrl?: string; 
}


// ==================================
// ||      API Response Types      ||
// ==================================
// These types match the structure of your API responses, including the
// '{ data: ... }' wrapper from your TransformResponseInterceptor.

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
