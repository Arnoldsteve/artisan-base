// File: .../payment/stripe/stripe.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_API_KEY');
    if (!apiKey) {
      throw new Error('Stripe API key is not configured.');
    }
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-07-30.basil',
      // ----------------------
    });
    this.logger.log('StripeService initialized.');
  }
// ...

  /**
   * Creates a Stripe Payment Intent.
   * This is the starting point for any card transaction.
   */
  async createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    try {
      // Stripe requires the amount in the smallest currency unit (e.g., cents)
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
      });
      
      this.logger.log(`Created Stripe Payment Intent: ${paymentIntent.id}`);
      return paymentIntent;

    } catch (error) {
      this.logger.error('Failed to create Stripe Payment Intent', error);
      throw new Error('Could not initiate payment with Stripe.');
    }
  }

  /**
   * Verifies a webhook signature to ensure it's genuinely from Stripe.
   */
  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    const secret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!secret) {
      throw new Error('Stripe webhook secret is not configured.');
    }

    try {
      return this.stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      this.logger.error('Stripe webhook signature verification failed', error);
      throw new Error('Webhook signature verification failed.');
    }
  }
}