import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IBillingRepository, FulfillSubscriptionData } from './interfaces/billing-repository.interface';
import { TenantSubscription, SubscriptionStatus } from '@prisma/client/management';

@Injectable()
export class BillingRepository implements IBillingRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Implements the interface method to get a tenant's subscription.
   */
  async getSubscription(tenantId: string): Promise<TenantSubscription | null> {
    return this.prisma.tenantSubscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });
  }

  /**
   * Implements the interface method to fulfill a subscription.
   * This contains the critical database transaction.
   */
  async fulfillSubscription(tenantId: string, data: FulfillSubscriptionData): Promise<void> {
    const subscriptionData = {
      planId: data.planId,
      status: SubscriptionStatus.ACTIVE,
      provider: data.provider,
      providerSubscriptionId: data.providerSubscriptionId,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
    };

    await this.prisma.$transaction(async (tx) => {
      // 1. Create or update the TenantSubscription record.
      const updatedSubscription = await tx.tenantSubscription.upsert({
        where: { tenantId },
        create: { tenantId, ...subscriptionData },
        update: subscriptionData,
      });

      // 2. Create the historical SubscriptionPayment log record.
      await tx.subscriptionPayment.create({
        data: {
          tenantId: tenantId,
          subscriptionId: updatedSubscription.id,
          amount: data.payment.amount,
          currency: data.payment.currency,
          status: 'COMPLETED',
          provider: data.provider,
          providerTransactionId: data.payment.providerTransactionId,
        },
      });

      // 3. Update the main Tenant status to ACTIVE.
      await tx.tenant.update({
        where: { id: tenantId },
        data: { status: 'ACTIVE' },
      });
    });
  }
}