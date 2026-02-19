import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { BillingRepository } from './repositories/billing.repository';
import { SubscriptionProviderRegistry } from './providers/subscription-provider.registry';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { BILLING_EVENTS } from './events/billing.events';
import { PaymentProvider } from '@generated/prisma/client';
import {
  SubscriptionWebhookResult,
} from './interfaces/subscription-provider.interface';
import { PlanService } from '@/plan/plan.service';

/**
 * Billing Orchestrator.
 * Knows about plans, subscriptions, tenants.
 * Delegates money movement to the correct provider via registry.
 * Emits typed business events — notification layer listens.
 */
@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly planService: PlanService,
    private readonly billingRepo: BillingRepository,
    private readonly registry: SubscriptionProviderRegistry,
    private readonly tenantContext: TenantContextService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─── Plans ───────────────────────────────────────────────────────────────────

  async getPlans() {
    return this.billingRepo.findAllPlans();
  }

  async getPlanById(planId: string) {
    const plan = await this.billingRepo.findPlanById(planId);
    if (!plan) throw new NotFoundException(`Plan ${planId} not found`);
    return plan;
  }

  // ─── Subscription ────────────────────────────────────────────────────────────

  async getSubscription() {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    const subscription = await this.billingRepo.findByTenantId(tenantId);
    if (!subscription) throw new NotFoundException(`No subscription found for tenant`);
    return subscription;
  }

  /**
   * Subscribe a tenant to a plan.
   * Intelligently routes to Stripe (automated) or Mpesa (manual)
   * based on tenant's baseCurrency.
   */
  async subscribe(dto: CreateSubscriptionDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    // 1. Validate plan exists
    const plan = await this.planService.findById(dto.planId);

    // 2. Get tenant's currency for intelligent routing
    const tenant = await this.billingRepo.findByTenantId(tenantId);
    const currency = tenant?.tenant?.baseCurrency;

    if (!currency) throw new BadRequestException('Tenant currency not configured');

    // 3. Validate provider-specific fields
    if (currency === 'KES' && !dto.phone) {
      throw new BadRequestException('Phone number is required for Mpesa billing');
    }
    if (currency !== 'KES' && !dto.stripePriceId) {
      throw new BadRequestException('Stripe Price ID is required for card billing');
    }

    // 4. Resolve correct provider via currency
    const provider = this.registry.getForCurrency(currency);

    // 5. Create subscription via provider
    const result = await provider.create({
      tenantId,
      planId: dto.planId,
      stripePriceId: dto.stripePriceId,
      amount: Number(plan.price),
      currency,
      phone: dto.phone,
      billingCycle: dto.billingCycle,
    });

    this.logger.log(
      `Subscription created | Tenant: ${tenantId} | Plan: ${plan.name} | Mode: ${provider.getBillingMode()}`,
    );

    // 6. Emit event — notification layer sends welcome email
    this.eventEmitter.emit(BILLING_EVENTS.SUBSCRIPTION_CREATED, {
      tenantId,
      planId: dto.planId,
      billingMode: provider.getBillingMode(),
      currency,
      currentPeriodEnd: result.currentPeriodEnd,
      checkoutUrl: result.checkoutUrl,
      stkPushRequestId: result.stkPushRequestId,
    });

    return result;
  }

  /**
   * Change tenant's subscription plan.
   */
  async changePlan(dto: ChangePlanDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    // 1. Get current subscription
    const subscription = await this.billingRepo.findByTenantId(tenantId);
    if (!subscription) throw new NotFoundException('No active subscription found');

    const oldPlanId = subscription.tenant.id;

    // 2. Resolve provider
    const provider = this.registry.getForCurrency(
      subscription.tenant.baseCurrency,
    );

    // 3. Delegate to provider
    const result = await provider.changePlan({
      providerSubscriptionId: subscription.providerSubscriptionId,
      newPlanId: dto.newPlanId,
      newStripePriceId: dto.newStripePriceId,
      newAmount: dto.newAmount,
    });

    this.logger.log(
      `Plan changed | Tenant: ${tenantId} | New Plan: ${dto.newPlanId}`,
    );

    // 4. Emit event
    this.eventEmitter.emit(BILLING_EVENTS.PLAN_CHANGED, {
      tenantId,
      oldPlanId,
      newPlanId: dto.newPlanId,
      currency: subscription.tenant.baseCurrency,
    });

    return result;
  }

  /**
   * Cancel tenant subscription.
   */
  async cancel(immediately: boolean = false) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    const subscription = await this.billingRepo.findByTenantId(tenantId);
    if (!subscription) throw new NotFoundException('No active subscription found');

    const provider = this.registry.getForCurrency(
      subscription.tenant.baseCurrency,
    );

    await provider.cancel({
      providerSubscriptionId: subscription.providerSubscriptionId,
      immediately,
    });

    this.logger.log(
      `Subscription cancelled | Tenant: ${tenantId} | Immediately: ${immediately}`,
    );

    this.eventEmitter.emit(BILLING_EVENTS.SUBSCRIPTION_CANCELED, {
      tenantId,
      canceledAt: new Date(),
      immediately,
    });

    return { success: true, immediately };
  }

  // ─── Webhooks ────────────────────────────────────────────────────────────────

  /**
   * Handles Stripe billing webhooks.
   * Mpesa subscription webhooks are handled via payment.updated event
   * directly in MpesaSubscriptionProvider — no route needed here.
   */
  async handleStripeWebhook(
    payload: Record<string, any>,
    signature: string,
  ) {
    const provider = this.registry.getForMode('AUTOMATED');
    const result = await provider.handleWebhook(payload, signature);

    if (!result.providerSubscriptionId) return { success: true };

    await this.processWebhookResult(result);
    return { success: true };
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  private async processWebhookResult(result: SubscriptionWebhookResult) {
    const subscription = await this.billingRepo.findByProviderSubscriptionId(
      result.providerSubscriptionId,
    );

    if (!subscription) {
      // First time — comes from checkout.session.completed
      // tenantId is in metadata
      this.logger.warn(
        `Subscription not found for provider ID: ${result.providerSubscriptionId}`,
      );
      return;
    }

    switch (result.status) {
      case 'ACTIVE':
        await this.billingRepo.activateSubscription({
          tenantId: subscription.tenantId,
          planId: subscription.tenant.id,
          providerSubscriptionId: result.providerSubscriptionId,
          billingMode: 'AUTOMATED',
          currentPeriodEnd: result.currentPeriodEnd,
        });

        this.eventEmitter.emit(BILLING_EVENTS.SUBSCRIPTION_RENEWED, {
          tenantId: subscription.tenantId,
          currentPeriodEnd: result.currentPeriodEnd,
        });
        break;

      case 'PAST_DUE':
        await this.billingRepo.updateSubscriptionStatus(
          subscription.tenantId,
          'PAST_DUE',
        );

        this.eventEmitter.emit(BILLING_EVENTS.SUBSCRIPTION_PAST_DUE, {
          tenantId: subscription.tenantId,
          currentPeriodEnd: subscription.currentPeriodEnd,
        });
        break;

      case 'CANCELED':
        await this.billingRepo.updateSubscriptionStatus(
          subscription.tenantId,
          'CANCELED',
        );

        this.eventEmitter.emit(BILLING_EVENTS.SUBSCRIPTION_CANCELED, {
          tenantId: subscription.tenantId,
          canceledAt: new Date(),
          immediately: false,
        });
        break;

      default:
        this.logger.warn(`Unhandled subscription status: ${result.status}`);
    }
  }
}