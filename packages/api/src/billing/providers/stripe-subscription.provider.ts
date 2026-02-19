import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  ISubscriptionProvider,
  BillingMode,
  CreateSubscriptionParams,
  SubscriptionResult,
  CancelSubscriptionParams,
  ChangePlanParams,
  SubscriptionWebhookResult,
} from '../interfaces/subscription-provider.interface';
import { SubscriptionProviderRegistry } from './subscription-provider.registry';

@Injectable()
export class StripeSubscriptionProvider implements ISubscriptionProvider, OnModuleInit {
  private readonly logger = new Logger(StripeSubscriptionProvider.name);
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(
    private readonly registry: SubscriptionProviderRegistry,
    private readonly config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.getOrThrow<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-08-27.basil',
    });
    this.webhookSecret = this.config.getOrThrow<string>('STRIPE_BILLING_WEBHOOK_SECRET');
  }

  onModuleInit() {
    this.registry.register(this);
  }

  getBillingMode(): BillingMode {
    return 'AUTOMATED';
  }

  // ─── ISubscriptionProvider Implementation ───────────────────────────────────

  async create(params: CreateSubscriptionParams): Promise<SubscriptionResult> {
    const customer = await this.getOrCreateCustomer(params.tenantId);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${this.config.get('FRONTEND_URL')}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.config.get('FRONTEND_URL')}/billing/cancelled`,
      metadata: {
        tenantId: params.tenantId,
        planId: params.planId,
        ...params.metadata,
      },
    });

    this.logger.log(`Stripe subscription session created | Tenant: ${params.tenantId}`);

    return {
      providerSubscriptionId: session.id,
      status: 'UNPAID',
      currentPeriodEnd: new Date(),
      checkoutUrl: session.url,
      metadata: { sessionId: session.id, customerId: customer.id },
    };
  }

  async cancel(params: CancelSubscriptionParams): Promise<void> {
    if (params.immediately) {
      await this.stripe.subscriptions.cancel(params.providerSubscriptionId);
    } else {
      await this.stripe.subscriptions.update(params.providerSubscriptionId, {
        cancel_at_period_end: true,
      });
    }
    this.logger.log(
      `Stripe subscription ${params.providerSubscriptionId} cancelled | Immediately: ${params.immediately}`,
    );
  }

  async changePlan(params: ChangePlanParams): Promise<SubscriptionResult> {
    const subscription = await this.stripe.subscriptions.retrieve(
      params.providerSubscriptionId,
    );

    const updated = await this.stripe.subscriptions.update(
      params.providerSubscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: params.newStripePriceId,
          },
        ],
        proration_behavior: 'always_invoice',
        metadata: { planId: params.newPlanId },
      },
    );

    // Cast to any — current_period_end exists at runtime but type differs in SDK v18
    const updatedSub = updated as any;

    return {
      providerSubscriptionId: updatedSub.id,
      status: this.mapStripeStatus(updatedSub.status),
      currentPeriodEnd: new Date(updatedSub.current_period_end * 1000),
    };
  }

  async handleWebhook(
    payload: Record<string, any>,
    signature?: string,
  ): Promise<SubscriptionWebhookResult> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload as any,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      this.logger.error(`Stripe billing webhook signature failed: ${err.message}`);
      throw err;
    }

    this.logger.log(`Stripe billing webhook | Event: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        return {
          providerSubscriptionId: sub.id,
          status: this.mapStripeStatus(sub.status),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          rawPayload: sub,
        };
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        return {
          providerSubscriptionId: sub.id,
          status: 'CANCELED',
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          rawPayload: sub,
        };
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        return {
          providerSubscriptionId: invoice.subscription as string,
          status: 'PAST_DUE',
          rawPayload: invoice,
        };
      }

      default:
        this.logger.warn(`Unhandled Stripe billing event: ${event.type}`);
        return {
          providerSubscriptionId: '',
          status: 'ACTIVE',
          rawPayload: event as any,
        };
    }
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  private async getOrCreateCustomer(tenantId: string): Promise<Stripe.Customer> {
    const existing = await this.stripe.customers.search({
      query: `metadata['tenantId']:'${tenantId}'`,
    });

    if (existing.data.length > 0) return existing.data[0];

    return this.stripe.customers.create({
      metadata: { tenantId },
    });
  }

  private mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionWebhookResult['status'] {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'ACTIVE';
      case 'past_due':
        return 'PAST_DUE';
      case 'canceled':
      case 'incomplete_expired':
        return 'CANCELED';
      case 'unpaid':
        return 'UNPAID';
      default:
        return 'UNPAID';
    }
  }
}