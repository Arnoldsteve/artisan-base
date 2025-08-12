import { Injectable, Inject, Scope, NotFoundException, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestWithTenant } from '../common/interfaces/request-with-tenant.interface';
import { TenantSubscription } from '@prisma/client/management';
import { StripeService } from '../shared/payment-providers/stripe/stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import Stripe from 'stripe';

// Import the repository interface and token
import { IBillingRepository } from './interfaces/billing-repository.interface';
// We also inject the plans service to look up plans by ID
import { PlatformPlansService } from '../platform/plans/platform-plans.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    // Inject the repository via its interface token
    @Inject(IBillingRepository)
    private readonly billingRepository: IBillingRepository,
    // We keep the PrismaService for tenant lookups in the checkout flow
    private readonly prisma: PrismaService,
    private readonly plansService: PlatformPlansService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: RequestWithTenant,
  ) {}

  /**
   * Delegates the work of fetching the subscription to the repository.
   */
  async getSubscription(): Promise<TenantSubscription | null> {
    const { id: tenantId } = this.request.tenant;
    return this.billingRepository.getSubscription(tenantId);
  }

  /**
   * Creates a Stripe Checkout session. This method orchestrates the flow
   * but does not contain the final database transaction logic.
   */
  async createCheckoutSession(dto: CreateCheckoutDto): Promise<{ checkoutUrl: string }> {
    const { id: tenantId } = this.request.tenant;
    
    // The service is responsible for validating the plan
    const planToSubscribe = await this.plansService.findPlanById(dto.planId);
    if (!planToSubscribe || !planToSubscribe.providerPlanId) {
      throw new NotFoundException(`Plan with ID '${dto.planId}' not found or not configured for payment.`);
    }

    let tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { owner: true },
    });
    
    if (!tenant) {
      throw new NotFoundException(`Authenticated tenant could not be found.`);
    }

    let stripeCustomerId = tenant.stripeCustomerId;
    if (!stripeCustomerId) {
      this.logger.log(`Creating Stripe customer for tenant: ${tenantId}`);
      const stripeCustomer = await this.stripeService.createCustomer({
        email: tenant.owner.email,
        name: tenant.name,
        metadata: { tenantId: tenant.id },
      });
      stripeCustomerId = stripeCustomer.id;

      // Update the tenant with the new Stripe Customer ID
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: { stripeCustomerId },
      });
    }

    const session = await this.stripeService.createCheckoutSession({
      customer: stripeCustomerId,
      line_items: [{ price: planToSubscribe.providerPlanId, quantity: 1 }],
      mode: 'subscription',
      client_reference_id: tenant.id,
      success_url: `${this.configService.get('DASHBOARD_URL')}/dashboard/settings?payment=success`,
      cancel_url: `${this.configService.get('DASHBOARD_URL')}/dashboard/settings`,
    });

    if (!session.url) {
      throw new Error('Failed to create Stripe Checkout Session URL.');
    }

    return { checkoutUrl: session.url };
  }

  /**
   * Processes webhook data, prepares a standardized object, and delegates
   * the final database transaction to the repository.
   */
  async fulfillSubscription(session: Stripe.Checkout.Session): Promise<void> {
    const tenantId = session.client_reference_id;
    const stripeSubscriptionId = session.subscription as string;
    
    if (!tenantId || !stripeSubscriptionId) {
      this.logger.error(`Webhook Error: Missing tenantId or subscriptionId in session`, session);
      return;
    }

    this.logger.log(`Fulfilling subscription for tenant: ${tenantId}, Stripe Sub ID: ${stripeSubscriptionId}`);
    
    const subscriptionDetails: Stripe.Subscription = await this.stripeService.getSubscription(stripeSubscriptionId);
    
    const priceId = subscriptionDetails.items.data[0].price.id;

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { providerPlanId: priceId },
    });

    if (!plan) {
      this.logger.error(`Webhook Error: Could not find internal plan matching Stripe Price ID: ${priceId}`);
      return;
    }

    // 1. The service's job is to prepare this clean, standardized data object.
    const fulfillmentData = {
      planId: plan.id,
      provider: 'STRIPE',
      providerSubscriptionId: subscriptionDetails.id,
      currentPeriodStart: new Date(subscriptionDetails.current_period_start * 1000),
      currentPeriodEnd: new Date(subscriptionDetails.current_period_end * 1000),
      payment: {
        amount: plan.price.toString(), 
        currency: (session.currency || 'usd').toUpperCase(),
        providerTransactionId: session.payment_intent as string,
      },
    };

    // 2. Delegate the entire database transaction to the repository.
    await this.billingRepository.fulfillSubscription(tenantId, fulfillmentData);

    this.logger.log(`Successfully fulfilled subscription for tenant: ${tenantId}`);
  }
}