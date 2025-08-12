import { TenantSubscription } from '@prisma/client/management';

/**
 * Defines the standardized data structure needed to fulfill a subscription.
 * The service layer is responsible for creating this object from webhook data.
 */
export interface FulfillSubscriptionData {
  planId: string;
  provider: string;
  providerSubscriptionId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  payment: {
    amount: number | string; // Allow string to handle Decimal conversion
    currency: string;
    providerTransactionId: string;
  };
}

export interface IBillingRepository {
  /**
   * Finds a tenant's subscription by their ID.
   */
  getSubscription(tenantId: string): Promise<TenantSubscription | null>;

  /**
   * Performs a transaction to create/update a subscription, create a payment log,
   * and update the tenant's status.
   */
  fulfillSubscription(tenantId: string, data: FulfillSubscriptionData): Promise<void>;
}

export const IBillingRepository = Symbol('IBillingRepository');