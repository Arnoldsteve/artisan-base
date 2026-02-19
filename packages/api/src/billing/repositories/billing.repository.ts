import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenantStatus, SubscriptionStatus } from '@generated/prisma/client';
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
        tenant: {
          select: {
            id: true, // ← add
            name: true,
            planId: true, // ← add
            baseCurrency: true,
          },
        },
      },
    });
  }

  async findByProviderSubscriptionId(providerSubscriptionId: string) {
    return this.prisma.tenantSubscription.findFirst({
      where: { providerSubscriptionId },
      include: {
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

  /**
   * Upsert — creates or updates the TenantSubscription.
   * Also reactivates the Tenant if it was SUSPENDED.
   */
  async activateSubscription(
    params: ActivateSubscriptionParams,
  ): Promise<void> {
    const currentPeriodEnd =
      params.currentPeriodEnd ?? this.calculatePeriodEnd();

    await this.prisma.$transaction([
      // 1. Upsert TenantSubscription
      this.prisma.tenantSubscription.upsert({
        where: { tenantId: params.tenantId },
        create: {
          tenantId: params.tenantId,
          providerSubscriptionId: params.providerSubscriptionId,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd,
        },
        update: {
          providerSubscriptionId: params.providerSubscriptionId,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd,
        },
      }),

      // 2. Update Tenant plan
      this.prisma.tenant.update({
        where: { id: params.tenantId },
        data: {
          planId: params.planId,
          status: TenantStatus.ACTIVE, // Reactivate if was SUSPENDED
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

  async cancelSubscription(providerSubscriptionId: string): Promise<void> {
    await this.prisma.tenantSubscription.updateMany({
      where: { providerSubscriptionId },
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

  /**
   * Finds subscriptions expiring within the next N days.
   * Used by scheduler to send reminders.
   */
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
              select: {
                email: true,
                firstName: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Finds subscriptions that have expired and are past the grace period.
   * Used by scheduler to suspend tenants.
   */
  async findExpiredSubscriptions(gracePeriodDays: number = 3) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - gracePeriodDays);

    return this.prisma.tenantSubscription.findMany({
      where: {
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.PAST_DUE],
        },
        currentPeriodEnd: { lt: cutoff },
      },
      include: {
        tenant: {
          select: { id: true, name: true, status: true },
        },
      },
    });
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  /**
   * Default period end = 30 days from now.
   * Used for Mpesa manual subscriptions (no Stripe to calculate this).
   */
  private calculatePeriodEnd(days: number = 30): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}
