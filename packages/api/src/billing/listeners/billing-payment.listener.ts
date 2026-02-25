import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BILLING_EVENTS, SubscriptionCreatedEvent } from '../events/billing.events';
import { PAYMENT_EVENTS, PaymentUpdatedEvent } from '@/payment/events/payment.events';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';
import { PaymentRepository } from '../../payment/repositories/payment.repository';

@Injectable()
export class BillingPaymentListener {
  private readonly logger = new Logger(BillingPaymentListener.name);

  constructor(
    @InjectQueue(QUEUES.PAYMENTS) private readonly paymentQueue: Queue,
    @InjectQueue(QUEUES.NOTIFICATIONS) private readonly notifyQueue: Queue,
    private readonly paymentRepo: PaymentRepository,
  ) {}

  /**
   * millions of users: Handled when a subscription is first requested.
   * If M-Pesa (Manual), we trigger the background STK push job.
   */
  @OnEvent(BILLING_EVENTS.SUBSCRIPTION_CREATED)
  async handleSubscriptionCreated(payload: SubscriptionCreatedEvent) {
    if (payload.billingMode === 'MANUAL') {
      await this.paymentQueue.add('INITIALIZE_SUBSCRIPTION_PAYMENT', payload);
    }
    
    // Always queue the billing/welcome notification
    await this.notifyQueue.add(JOB_NAMES.SEND_WELCOME_EMAIL, payload);
  }

  /**
   * TOP 1% LOGIC: Payment Reconciliation Bridge
   * millions of users: This listens to ALL payment updates, but only 
   * processes those belonging to the Billing domain.
   */
  @OnEvent(PAYMENT_EVENTS.PAYMENT_UPDATED)
  async handlePaymentUpdated(event: PaymentUpdatedEvent) {
    // 1. Fetch the payment to check the 'type' in metadata
    // We use the base repo to ensure we see the record regardless of bubble
    const payment = await this.paymentRepo.findById(event.paymentId);
    
    const type = (payment?.metadata as any)?.type;

    if (type === 'SUBSCRIPTION') {
      this.logger.log(`Bridging confirmed Subscription payment to worker: ${event.paymentId}`);
      
      // 2. Queue the business logic (Plan update, Expiry extension)
      await this.paymentQueue.add(JOB_NAMES.SYNC_SUBSCRIPTION_STATUS, {
        ...event,
        metadata: payment.metadata // Pass metadata containing planId and billingCycle
      });
    }
  }
}