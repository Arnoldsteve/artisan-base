import { TenantSubscription } from '@prisma/client/management';


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

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  amount: string;
  currency: string;
  status: string;
  provider: string;
  providerTransactionId: string;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  issuedAt: Date;
  planName: string;
}

export interface IBillingRepository {
  getSubscription(tenantId: string): Promise<TenantSubscription | null>;
  fulfillSubscription(tenantId: string, data: FulfillSubscriptionData): Promise<void>;
  getInvoicesForTenant(tenantId: string): Promise<InvoiceRecord[]>;
}

export const IBillingRepository = Symbol('IBillingRepository');