import { apiClient } from "@/lib/client-api";
import {
  SubscriptionPlan,
  TenantSubscription,
  CreateSubscriptionDto,
  ChangePlanDto,
} from "@/types/billing";

/**
 * SOLID Principle: Single Responsibility
 * This service orchestrates all financial and subscription requests.
 */
export class BillingService {
  /**
   * GLOBAL: Fetches all available platform tiers (Basic, Pro, Enterprise).
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    return apiClient.get<SubscriptionPlan[]>("/billing/plans");
  }

  /**
   * ISOLATED: Fetches the current subscription status for the active store.
   */
  async getSubscription(): Promise<TenantSubscription> {
    return apiClient.get<TenantSubscription>("/billing/subscription");
  }

  /**
   * ACTION: Initiates a new subscription.
   * millions of users: Backend intelligently routes to M-Pesa (KES) or Stripe (USD).
   */
  async subscribe(data: CreateSubscriptionDto): Promise<any> {
    return apiClient.post("/billing/subscribe", data);
  }

  /**
   * ACTION: Upgrades or downgrades the current plan.
   */
  async changePlan(data: ChangePlanDto): Promise<any> {
    return apiClient.patch("/billing/change-plan", data);
  }

  /**
   * ACTION: Cancels the subscription.
   * @param immediately - if true, kills access now; if false, at period end.
   */
  async cancel(immediately: boolean = false): Promise<void> {
    await apiClient.patch(`/billing/cancel?immediately=${immediately}`);
  }

  async getHistory(): Promise<any[]> {
    return apiClient.get<any[]>("/billing/history");
  }
}

export const billingService = new BillingService();