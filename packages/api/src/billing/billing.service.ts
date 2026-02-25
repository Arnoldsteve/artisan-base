import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { BillingRepository } from './repositories/billing.repository';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { BILLING_EVENTS } from './events/billing.events';
import { PlanService } from '@/plan/plan.service';
import { PaymentService } from '@/payment/payment.service';
import { PaymentProviderRegistry } from '@/payment/providers/payment-provider.registry';
import { PaymentFulfillmentType } from '@/payment/interfaces/payment-provider.interface';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly planService: PlanService,
    private readonly billingRepo: BillingRepository,
    private readonly paymentService: PaymentService,
    private readonly paymentRegistry: PaymentProviderRegistry,
    private readonly tenantContext: TenantContextService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─── Plans ───────────────────────────────────────────────────────────────────

  async getPlans() {
    return this.billingRepo.findAllPlans();
  }

  // ─── Subscription ────────────────────────────────────────────────────────────

  async getSubscription() {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    const subscription = await this.billingRepo.findByTenantId(tenantId);
    if (!subscription) throw new NotFoundException(`No subscription found for tenant`);
    return subscription;
  }

  /**
   * TOP 1% LOGIC: Universal Subscription Provisioning
   * millions of users: This method coordinates with the Payment Module 
   * to handle both African (M-Pesa) and Global (Stripe) flows.
   */
  async subscribe(dto: CreateSubscriptionDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    // 1. Logic: Identity & Plan Validation
    const [plan, tenant] = await Promise.all([
      this.planService.findById(dto.planId),
      this.billingRepo.findTenantById(tenantId),
    ]);

    if (!tenant) throw new BadRequestException('Tenant not found');
    const currency = tenant.baseCurrency;

    // 2. Identify the correct Provider (Strategy Pattern)
    const providerType = currency === 'KES' ? 'MPESA' : 'STRIPE';
    const strategy = this.paymentRegistry.get(providerType as any);
    
    // 3. Generate a Unique Reference for this financial event
    const reference = `SUB-${tenantId.slice(-6)}-${Date.now()}`;

    let checkoutUrl: string | undefined;

    // 4. HYBRID FLOW: If the provider requires a Redirect (Stripe/PayPal)
    // we must initialize it SYNC to get the URL for the frontend.
    if (strategy.getFulfillmentType() === PaymentFulfillmentType.REDIRECT) {
      const result = await this.paymentService.initiate({
        provider: providerType as any,
        amount: Number(plan.price),
        currency,
        reference,
        description: `Subscription: ${plan.name} (${dto.billingCycle})`,
        metadata: { type: 'SUBSCRIPTION', planId: plan.id, billingCycle: dto.billingCycle }
      });
      checkoutUrl = result.checkoutUrl;
    }

    /**
     * 5. EVENT EMISSION: 
     * If provider is PUSH (Mpesa), the 'BillingPaymentListener' will 
     * see this event and add a job to BullMQ to trigger the STK Push.
     */
    this.eventEmitter.emit(BILLING_EVENTS.SUBSCRIPTION_CREATED, {
      tenantId,
      planId: dto.planId,
      billingCycle: dto.billingCycle,
      currency,
      amount: Number(plan.price),
      phone: dto.phone,
      reference,
      checkoutUrl,
      billingMode: strategy.getFulfillmentType() === PaymentFulfillmentType.REDIRECT ? 'AUTOMATED' : 'MANUAL',
    });

    return {
      success: true,
      reference,
      checkoutUrl, // Frontend will redirect if present
    };
  }

  /**
   * ACTION: Upgrade or Downgrade Plan.
   * millions of users: Orchestrates the plan change via the Payment Module.
   */
  async changePlan(dto: ChangePlanDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    const subscription = await this.getSubscription();

    const plan = await this.planService.findById(dto.newPlanId);
    const strategy = this.paymentRegistry.get(subscription.tenant.baseCurrency === 'KES' ? 'MPESA' : 'STRIPE');

    const reference = `UPG-${tenantId.slice(-6)}-${Date.now()}`;

    // If it's a redirect-based upgrade (e.g. Stripe checkout for new price)
    let checkoutUrl: string | undefined;
    if (strategy.getFulfillmentType() === PaymentFulfillmentType.REDIRECT) {
      const result = await this.paymentService.initiate({
        provider: strategy.getName(),
        amount: Number(plan.price),
        currency: subscription.tenant.baseCurrency,
        reference,
        metadata: { type: 'SUBSCRIPTION', planId: plan.id, isUpgrade: true }
      });
      checkoutUrl = result.checkoutUrl;
    }

    this.eventEmitter.emit(BILLING_EVENTS.PLAN_CHANGED, {
      tenantId,
      oldPlanId: subscription.planId,
      newPlanId: dto.newPlanId,
      reference,
      checkoutUrl
    });

    return { success: true, checkoutUrl };
  }
  
  // ─── Management ──────────────────────────────────────────────────────────────

  async cancel(immediately: boolean = false) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    const subscription = await this.getSubscription();

    // Note: Actual cancellation logic with the provider (Stripe) 
    // happens in the background worker triggered by this event.
    this.eventEmitter.emit(BILLING_EVENTS.SUBSCRIPTION_CANCELED, {
      tenantId,
      providerSubscriptionId: subscription.providerSubscriptionId,
      immediately,
    });

    return { success: true, immediately };
  }

  async getHistory() {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    return this.billingRepo.findPaymentHistory(tenantId);
  }
}