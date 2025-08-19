import { TenantSubscription } from '@prisma/client/management';

// Define the shape of the data needed for the upsert operation for type safety
export interface SubscriptionUpsertData {
  planId: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'UNPAID';
  provider: string;
  providerSubscriptionId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export interface IBillingRepository {
  /**
   * Finds a subscription by the tenant's ID.
   * @param tenantId The ID of the tenant.
   */
  getSubscription(tenantId: string): Promise<TenantSubscription | null>;

  /**
   * Creates or updates a tenant's subscription in a single transaction.
   * @param tenantId The ID of the tenant to update.
   * @param data The data for the new or updated subscription.
   */
  upsertSubscription(tenantId: string, data: SubscriptionUpsertData): Promise<void>;
}

export const IBillingRepository = Symbol('IBillingRepository');