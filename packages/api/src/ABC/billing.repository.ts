import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Inject the management Prisma service
import {
  IBillingRepository,
  SubscriptionUpsertData,
} from './interfaces/billing-repository.interface';
import { TenantSubscription } from '@prisma/client/management';

// NOTE: This is now a singleton, not request-scoped, because it only
// interacts with the global management database.
@Injectable()
export class BillingRepository implements IBillingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(tenantId: string): Promise<TenantSubscription | null> {
    return this.prisma.tenantSubscription.findUnique({
      where: { tenantId },
      include: {
        plan: true, // Include the plan details for the UI
      },
    });
  }

  async upsertSubscription(
    tenantId: string,
    data: SubscriptionUpsertData,
  ): Promise<void> {
    // This transaction ensures both the subscription and the tenant status are updated together.
    await this.prisma.$transaction([
      // Operation 1: Create or update the subscription record.
      this.prisma.tenantSubscription.upsert({
        where: { tenantId: tenantId },
        create: {
          tenantId: tenantId,
          ...data,
        },
        update: data,
      }),
      // Operation 2: Ensure the tenant's main status is active.
      this.prisma.tenant.update({
        where: { id: tenantId },
        data: { status: 'ACTIVE' },
      }),
    ]);
  }
}
