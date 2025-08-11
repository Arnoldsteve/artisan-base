import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestWithTenant } from '../../common/interfaces/request-with-tenant.interface';
import { IBillingRepository } from './interfaces/billing-repository.interface';
import { TenantSubscription } from '@prisma/client/management';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class BillingService {
  constructor(
    @Inject(IBillingRepository)
    private readonly billingRepository: IBillingRepository, // Inject via token
    private readonly managementPrisma: PrismaService,
    @Inject(REQUEST) private readonly request: RequestWithTenant,
  ) {}

  async getSubscriptionForCurrentTenant(): Promise<TenantSubscription | null> {
    const tenantId = this.request.tenant.id;
    return this.managementPrisma.tenantSubscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });
  }

  async getInvoicesForCurrentTenant(): Promise<any[]> {
    // Placeholder for payment provider logic
    return [];
  }

  async changePlanForCurrentTenant(planId: string): Promise<{ checkoutUrl: string }> {
    // Placeholder for payment provider logic
    return { checkoutUrl: 'https://example.com/checkout' };
  }
}