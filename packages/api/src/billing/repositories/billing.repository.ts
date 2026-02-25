import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenantStatus, SubscriptionStatus, Currency } from '@generated/prisma/client';
import { BillingMode } from '../interfaces/subscription-provider.interface';

export interface ActivateSubscriptionParams {
  tenantId: string;
  planId: string;
  providerSubscriptionId: string;
  billingMode: BillingMode;
  currentPeriodEnd?: Date;
}

@Injectable()
export class BillingRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Tenant ──────────────────────────────────────────────────────────────────

  async findTenantById(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, baseCurrency: true, status: true },
    });
  }

  // ─── Subscription Plan ───────────────────────────────────────────────────────

  async findPlanById(planId: string) {
    return this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
  }

  async findAllPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  // ─── Tenant Subscription ─────────────────────────────────────────────────────

  async findByTenantId(tenantId: string) {
    return this.prisma.tenantSubscription.findUnique({
      where: { tenantId },
      include: {
        plan: true,
        tenant: {
          select: {
            id: true,
            name: true,
            planId: true,
            baseCurrency: true,
          },
        },
      },
    });
  }

  async findByPaymentId(paymentId: string) {
    return this.prisma.tenantSubscription.findFirst({
      where: { paymentId },
      include: {
        plan: true,
        tenant: {
          select: {
            id: true,
            baseCurrency: true,
            status: true,
          },
        },
      },
    });
  }

  async activateSubscription(params: ActivateSubscriptionParams): Promise<void> {
    const currentPeriodEnd = params.currentPeriodEnd ?? this.calculatePeriodEnd();

    await this.prisma.$transaction([
      this.prisma.tenantSubscription.upsert({
        where: { tenantId: params.tenantId },
        create: {
          tenantId: params.tenantId,
          planId: params.planId,
          paymentId: params.providerSubscriptionId,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd,
        },
        update: {
          planId: params.planId, 
          paymentId: params.providerSubscriptionId,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd,
        },
      }),
      this.prisma.tenant.update({
        where: { id: params.tenantId },
        data: {
          planId: params.planId,
          status: TenantStatus.ACTIVE,
        },
      }),
    ]);
  }

  async updateSubscriptionStatus(
    tenantId: string,
    status: SubscriptionStatus,
    currentPeriodEnd?: Date,
  ): Promise<void> {
    await this.prisma.tenantSubscription.update({
      where: { tenantId },
      data: {
        status,
        ...(currentPeriodEnd && { currentPeriodEnd }),
      },
    });
  }

  async cancelSubscription(paymentId: string): Promise<void> {
    await this.prisma.tenantSubscription.updateMany({
      where: { paymentId },
      data: { status: SubscriptionStatus.CANCELED },
    });
  }

  // ─── Tenant Status ───────────────────────────────────────────────────────────

  async suspendTenant(tenantId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.tenant.update({
        where: { id: tenantId },
        data: { status: TenantStatus.SUSPENDED },
      }),
      this.prisma.tenantSubscription.update({
        where: { tenantId },
        data: { status: SubscriptionStatus.PAST_DUE },
      }),
    ]);
  }

  // ─── Scheduler Queries ───────────────────────────────────────────────────────

  async findExpiringSubscriptions(withinDays: number) {
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + withinDays);

    return this.prisma.tenantSubscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: { gte: from, lte: to },
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            baseCurrency: true,
            owner: {
              select: { email: true, firstName: true },
            },
          },
        },
      },
    });
  }

  async findExpiredSubscriptions(gracePeriodDays: number = 3) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - gracePeriodDays);

    return this.prisma.tenantSubscription.findMany({
      where: {
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.PAST_DUE] },
        currentPeriodEnd: { lt: cutoff },
      },
      include: {
        tenant: {
          select: { id: true, name: true, status: true },
        },
      },
    });
  }


  // ─── Payment History ─────────────────────────────────────────────────────────

  /**
   * Fetches all subscription-related payments for the current tenant.
   * millions of users: Filters by type 'SUBSCRIPTION' within the isolated context.
   */
  async findPaymentHistory(tenantId: string) {
    return this.prisma.client.payment.findMany({
      where: { 
        type: 'SUBSCRIPTION' // Use the enum to filter for billing only
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        provider: true,
        status: true,
        createdAt: true,
        metadata: true,
        // Since type is SUBSCRIPTION, currency can be inferred or added to model if needed
      }
    });
  }
  
  // ─── Private Helpers ─────────────────────────────────────────────────────────

  private calculatePeriodEnd(days: number = 30): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}