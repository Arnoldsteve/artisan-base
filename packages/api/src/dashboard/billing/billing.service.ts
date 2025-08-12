import { Injectable, Inject, Scope, Logger, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestWithTenant } from '../../common/interfaces/request-with-tenant.interface';
import { IBillingRepository } from './interfaces/billing-repository.interface';
import { SubscriptionStatus, TenantSubscription } from '@prisma/client/management';
// We still need the plans service to validate the plan ID
import { PlatformPlansService } from '../../platform/plans/platform-plans.service';

@Injectable({ scope: Scope.REQUEST })
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @Inject(IBillingRepository)
    private readonly billingRepository: IBillingRepository,
    private readonly plansService: PlatformPlansService, // Inject plans service
    @Inject(REQUEST) private readonly request: RequestWithTenant,
  ) {}

  /**
   * Delegates fetching the subscription to the repository.
   */
  async getSubscriptionForCurrentTenant(): Promise<TenantSubscription | null> {
    const tenantId = this.request.tenant.id;
    return this.billingRepository.getSubscription(tenantId);
  }

  /**
   * Simulates a successful payment by creating/updating the subscription in the database via the repository.
   */
  async changePlanForCurrentTenant(planId: string): Promise<{ success: boolean; message: string }> {
    const { id: tenantId } = this.request.tenant;

    // 1. Service logic: Validate that the plan exists before doing anything.
    const planToSubscribe = await this.plansService.findPlanById(planId);
    if (!planToSubscribe) {
      throw new NotFoundException(`Plan with ID '${planId}' could not be found.`);
    }

    // 2. Service logic: Prepare the data object for the repository.
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const subscriptionData = {
      planId: planId,
      status: SubscriptionStatus.ACTIVE,
      provider: 'INTERNAL_SIMULATION',
      providerSubscriptionId: `sim_${tenantId}_${Date.now()}`,
      currentPeriodStart: today,
      currentPeriodEnd: thirtyDaysFromNow,
    };

    try {
      // 3. Delegate the actual database transaction to the repository.
      await this.billingRepository.upsertSubscription(tenantId, subscriptionData);

      this.logger.log(
        `SUCCESS: Simulated plan change for Tenant '${tenantId}' to Plan '${planToSubscribe.name}'.`,
      );

      return { success: true, message: 'Your plan has been updated successfully!' };
    } catch (error) {
      this.logger.error(`Failed to simulate plan change for Tenant '${tenantId}'.`, error.stack);
      throw new Error('An unexpected error occurred while updating your plan.');
    }
  }

  async getInvoicesForCurrentTenant(): Promise<any[]> {
    this.logger.log(`Fetching invoices for tenant: ${this.request.tenant.id}`);
    // In a real app, you would fetch this from Stripe or another provider.
    return []; // Return an empty array for now
  }
  
}