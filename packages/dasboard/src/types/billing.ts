export type BillingCycle = "MONTHLY" | "YEARLY";

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  features?: string[];
}

export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "PAST_DUE";

export interface Subscription {
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  plan: Plan;
}

export type InvoiceStatus = "PAID" | "DUE" | "FAILED";

export interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: InvoiceStatus;
}
