import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SubscriptionProviderRegistry } from './subscription-provider.registry';
import { BillingRepository } from '../repositories/billing.repository';
import { PaymentService } from '@/payment/payment.service';
import { PaymentProvider } from '@generated/prisma/client';
import {
  ISubscriptionProvider,
  BillingMode,
  CreateSubscriptionParams,
  SubscriptionResult,
  CancelSubscriptionParams,
  ChangePlanParams,
  SubscriptionWebhookResult,
} from '../interfaces/subscription-provider.interface';
import { PaymentUpdatedEvent } from '@/payment/events/payment.events';

/**
 * Manual Subscription Provider.
 * No auto-renewal — tenant pays manually via Mpesa STK Push.
 * Listens to payment.updated event to activate/extend subscription.
 */
@Injectable()
export class MpesaSubscriptionProvider implements ISubscriptionProvider, OnModuleInit {
  private readonly logger = new Logger(MpesaSubscriptionProvider.name);

  constructor(
    private readonly registry: SubscriptionProviderRegistry,
    private readonly paymentService: PaymentService,
    private readonly billingRepo: BillingRepository,
  ) {}

  onModuleInit() {
    this.registry.register(this);
  }

  getBillingMode(): BillingMode {
    return 'MANUAL';
  }

  // ─── ISubscriptionProvider Implementation ───────────────────────────────────

  /**
   * Initiates Mpesa STK Push for subscription payment.
   * Subscription becomes ACTIVE only after payment.updated event confirms PAID.
   */
  async create(params: CreateSubscriptionParams): Promise<SubscriptionResult> {
    const reference = `SUB:${params.tenantId}:${params.planId}:${Date.now()}`;

    const result = await this.paymentService.initiate({
      provider: PaymentProvider.MPESA,
      amount: params.amount,
      currency: params.currency,
      phone: params.phone,
      description: `Subscription payment`,
      reference,
      metadata: {
        tenantId: params.tenantId,
        planId: params.planId,
        billingCycle: params.billingCycle,
        phone: params.phone,   // ← stored for changePlan retrieval
        type: 'SUBSCRIPTION',
      },
    });

    this.logger.log(
      `Mpesa subscription STK Push sent | Tenant: ${params.tenantId} | Ref: ${reference}`,
    );

    return {
      providerSubscriptionId: reference,
      status: 'UNPAID',
      currentPeriodEnd: new Date(),
      stkPushRequestId: (result as any).stkPushRequestId,
      metadata: {
        paymentId: (result as any).paymentId,
        reference,
      },
    };
  }

  /**
   * Cancel = just mark as canceled in DB.
   * No external API call needed.
   */
  async cancel(params: CancelSubscriptionParams): Promise<void> {
    await this.billingRepo.cancelSubscription(params.providerSubscriptionId);
    this.logger.log(
      `Mpesa subscription cancelled | Ref: ${params.providerSubscriptionId}`,
    );
  }

  /**
   * Change plan = cancel current + initiate new STK push for new plan amount.
   */
  async changePlan(params: ChangePlanParams): Promise<SubscriptionResult> {
    // 1. Cancel current subscription
    await this.cancel({ providerSubscriptionId: params.providerSubscriptionId });

    // 2. Fetch subscription to retrieve stored details
    const subscription = await this.billingRepo.findByProviderSubscriptionId(
      params.providerSubscriptionId,
    );

    // 3. Retrieve phone and billingCycle stored in metadata during create()
    const metadata = (subscription as any).metadata ?? {};

    // 4. Initiate new subscription payment for new plan
    return this.create({
      tenantId: subscription.tenantId,
      planId: params.newPlanId,
      amount: params.newAmount,
      currency: subscription.tenant.baseCurrency,
      phone: metadata.phone ?? '',
      billingCycle: metadata.billingCycle ?? 'MONTHLY',
    });
  }

  /**
   * Mpesa has no subscription webhooks — no-op.
   * Activation happens via payment.updated event below.
   */
  async handleWebhook(): Promise<SubscriptionWebhookResult> {
    return {
      providerSubscriptionId: '',
      status: 'ACTIVE',
    };
  }

  // ─── Event Listener ──────────────────────────────────────────────────────────

  /**
   * Listens to PaymentService's raw payment.updated event.
   * Reference prefix SUB: → subscription payment.
   * Activates TenantSubscription on PAID.
   */
  @OnEvent('payment.updated')
  async onPaymentUpdated(event: PaymentUpdatedEvent): Promise<void> {
    if (!event.reference?.startsWith('SUB:')) return;

    this.logger.log(
      `Mpesa subscription payment event | Ref: ${event.reference} | Status: ${event.status}`,
    );

    if (event.status === 'PAID') {
      // Reference format: SUB:{tenantId}:{planId}:{timestamp}
      const [, tenantId, planId] = event.reference.split(':');

      await this.billingRepo.activateSubscription({
        tenantId,
        planId,
        providerSubscriptionId: event.reference,
        billingMode: 'MANUAL',
      });

      this.logger.log(
        `Mpesa subscription ACTIVATED | Tenant: ${tenantId} | Plan: ${planId}`,
      );
    }

    if (event.status === 'FAILED') {
      this.logger.warn(
        `Mpesa subscription payment FAILED | Ref: ${event.reference}`,
      );
      // Scheduler handles suspension if expiry passes
    }
  }
}