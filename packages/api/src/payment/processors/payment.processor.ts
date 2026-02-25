import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES } from '../../common/queues/queue.constants';
import { PaymentService } from '../payment.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { CheckoutCompletedEvent } from '../../order/events/order.events';
import { SubscriptionCreatedEvent } from '@/billing/events/billing.events';
import { PaymentType } from '@generated/prisma/enums';

/**
 * TOP 1% ARCHITECTURE: Background Payment Processor
 * This worker executes the actual API calls to payment gateways (Mpesa/Stripe).
 * It runs outside the HTTP request cycle for maximum system responsiveness.
 */
@Processor(QUEUES.PAYMENTS)
export class PaymentProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentProcessor.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly tenantContext: TenantContextService,
  ) {
    super();
  }

  /**
   * Main entry point for the background worker.
   */
  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing ${job.name} [ID: ${job.id}]`);

    switch (job.name) {
      case 'INITIALIZE_CHECKOUT_PAYMENT':
        return this.handleCheckoutPayment(job.data);

      case 'INITIALIZE_SUBSCRIPTION_PAYMENT':
        return this.handleSubscriptionPayment(job.data);

      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  /**
   * millions of users: Handled in the background to avoid API timeouts.
   * If Safaricom or Stripe is slow, only this worker waits.
   */
  private async handleCheckoutPayment(data: CheckoutCompletedEvent) {
    // 1. TOP 1% REQUIREMENT: Re-establish Tenant Context
    // We pick the primary tenant from the checkout event to enter the 'bubble'
    const tenantId = data.tenantIds[0];

    /**
     * We use tenantContext.run() to ensure that any DB call made 
     * inside the PaymentService is automatically isolated 
     * to the correct artisan's data.
     */
    return this.tenantContext.run(tenantId, async () => {
      try {
        this.logger.debug(`Initiating ${data.paymentProvider} for Ref: ${data.paymentReference}`);

        return await this.paymentService.initiate({
          provider: data.paymentProvider,
          amount: data.totalAmount,
          currency: data.currency,
          reference: data.paymentReference,
          phone: (data as any).customerPhone, // Passed from order listener
          description: `Marketplace Checkout: ${data.orderIds.length} orders`,
          metadata: {
            orderIds: data.orderIds,
            type: PaymentType.ORDER,
          },
        });
      } catch (error) {
        this.logger.error(`Payment initiation failed for ${data.paymentReference}`, error.stack);
        // Throwing here allows BullMQ to use its configured 'backoff' and retry automatically
        throw error; 
      }
    });
  }

  /**
   * ✅ ADD THIS METHOD:
   * billions of users: Handles background initiation for Store Subscriptions.
   */
  private async handleSubscriptionPayment(data: SubscriptionCreatedEvent) {
    return this.tenantContext.run(data.tenantId, async () => {
      try {
        this.logger.debug(`Initiating Sub Payment for Tenant: ${data.tenantId} | Ref: ${data.reference}`);

        return await this.paymentService.initiate({
          provider: data.currency === 'KES' ? 'MPESA' : 'STRIPE',
          amount: data.amount,
          currency: data.currency,
          reference: data.reference,
          phone: data.phone,
          description: `Store Subscription: ${data.tenantName}`,
          metadata: {
            planId: data.planId,
            billingCycle: data.billingCycle,
            type: PaymentType.SUBSCRIPTION, 
          },
        });
      } catch (error) {
        this.logger.error(`Subscription initiation failed for ${data.reference}`, error.stack);
        throw error; // Triggers BullMQ retry
      }
    });
  }
}