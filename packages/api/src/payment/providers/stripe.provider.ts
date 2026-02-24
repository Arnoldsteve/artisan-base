import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider, PaymentStatus } from '@generated/prisma/client';
import Stripe from 'stripe';
import {
  IPaymentProvider,
  PaymentFulfillmentType,
  PaymentInitParams,
  PaymentInitResult,
  PaymentVerifyResult,
} from '../interfaces/payment-provider.interface';
import { PaymentProviderRegistry } from './payment-provider.registry';

@Injectable()
export class StripeProvider implements IPaymentProvider, OnModuleInit {
  private readonly logger = new Logger(StripeProvider.name);
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(
    private readonly registry: PaymentProviderRegistry,
    private readonly config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.getOrThrow<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-08-27.basil',
    });
    this.webhookSecret = this.config.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');
  }

  onModuleInit() {
    this.registry.register(this);
  }

  getName(): PaymentProvider {
    return PaymentProvider.STRIPE;
  }

  getFulfillmentType(): PaymentFulfillmentType {
      return PaymentFulfillmentType.REDIRECT;
    } 

  // ─── IPaymentProvider Implementation ────────────────────────────────────────

  /**
   * Creates a Stripe Checkout Session.
   * Returns a checkoutUrl the frontend redirects to.
   */
  async initialize(params: PaymentInitParams): Promise<PaymentInitResult> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: params.currency.toLowerCase(),
            unit_amount: Math.round(params.amount * 100), // Stripe uses cents
            product_data: {
              name: params.description ?? 'Order Payment',
            },
          },
        },
      ],
      success_url: params.returnUrl ?? `${this.config.get('FRONTEND_URL')}/payment/success`,
      cancel_url: `${this.config.get('FRONTEND_URL')}/payment/cancelled`,
      metadata: {
        reference: params.reference,
        ...params.metadata,
      },
    });

    this.logger.log(`Stripe Checkout Session created | Ref: ${params.reference}`);

    return {
      providerTransactionId: session.id,
      checkoutUrl: session.url,
      metadata: {
        sessionId: session.id,
        paymentIntent: session.payment_intent as string,
      },
    };
  }

  /**
   * Retrieves Stripe Checkout Session and maps status.
   */
  async verify(providerTransactionId: string): Promise<PaymentVerifyResult> {
    const session = await this.stripe.checkout.sessions.retrieve(
      providerTransactionId,
    );

    const status = this.mapStripeStatus(session.payment_status);

    return {
      providerTransactionId,
      status,
      rawPayload: session as any,
    };
  }

  /**
   * Verifies Stripe webhook signature and parses event.
   * POST /payments/webhook/stripe
   * Requires raw body — ensure NestJS is configured to pass raw body for this route.
   */
  async handleWebhook(
    payload: Record<string, any>,
    signature?: string,
  ): Promise<PaymentVerifyResult> {
    let event: Stripe.Event;

    try {
      // Stripe requires raw buffer for signature verification
      event = this.stripe.webhooks.constructEvent(
        payload as any,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      this.logger.error(`Stripe webhook signature verification failed: ${err.message}`);
      throw err;
    }

    this.logger.log(`Stripe webhook received | Event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        return {
          providerTransactionId: session.id,
          status: this.mapStripeStatus(session.payment_status),
          rawPayload: session as any,
        };
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        return {
          providerTransactionId: session.id,
          status: PaymentStatus.FAILED,
          rawPayload: session as any,
        };
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        return {
          providerTransactionId: charge.payment_intent as string,
          status: PaymentStatus.REFUNDED,
          rawPayload: charge as any,
        };
      }

      default:
        this.logger.warn(`Unhandled Stripe event type: ${event.type}`);
        return {
          providerTransactionId: '',
          status: PaymentStatus.PENDING,
          rawPayload: event as any,
        };
    }
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  private mapStripeStatus(stripeStatus: Stripe.Checkout.Session.PaymentStatus): PaymentStatus {
    switch (stripeStatus) {
      case 'paid':
        return PaymentStatus.PAID;
      case 'unpaid':
        return PaymentStatus.PENDING;
      case 'no_payment_required':
        return PaymentStatus.PAID;
      default:
        return PaymentStatus.PENDING;
    }
  }
}