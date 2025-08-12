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
    // Note: I've updated the apiVersion to a valid, recent version.
    this.stripe = new Stripe(apiKey, {
       apiVersion: '2025-07-30.basil',
    });
    this.logger.log('StripeService initialized.');
  }

  /**
   * Creates a Stripe Payment Intent for one-off e-commerce payments.
   */
  async createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    try {
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

  // --- NEW METHODS FOR SUBSCRIPTION BILLING ---

  /**
   * Creates a new Customer object in Stripe.
   * This is used to associate subscriptions and payments with a specific tenant.
   * @param params - The customer creation parameters (e.g., email, name).
   */
  async createCustomer(params: Stripe.CustomerCreateParams): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create(params);
      this.logger.log(`Created Stripe Customer: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error('Failed to create Stripe Customer', error);
      throw new Error('Could not create customer in Stripe.');
    }
  }

  /**
   * Creates a new Checkout Session for starting a subscription.
   * This generates the URL that the user will be redirected to for payment.
   * @param params - The session creation parameters.
   */
  async createCheckoutSession(params: Stripe.Checkout.SessionCreateParams): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create(params);
      this.logger.log(`Created Stripe Checkout Session: ${session.id}`);
      return session;
    } catch (error) {
      this.logger.error('Failed to create Stripe Checkout Session', error);
      throw new Error('Could not create checkout session in Stripe.');
    }
  }

  /**
   * Retrieves a full Subscription object from Stripe by its ID.
   * This is used by the webhook to get the latest details of a subscription.
   * @param id - The Stripe Subscription ID (e.g., "sub_...").
   */
  async getSubscription(id: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(id);
    } catch (error) {
      this.logger.error(`Failed to retrieve Stripe Subscription: ${id}`, error);
      throw new Error(`Could not retrieve subscription ${id} from Stripe.`);
    }
  }
  
  // --- WEBHOOK METHOD REMAINS THE SAME ---

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