import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BILLING_EVENTS, SubscriptionCreatedEvent } from '../events/billing.events';
import { PAYMENT_EVENTS, PaymentUpdatedEvent } from '@/payment/events/payment.events';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';
import { PaymentRepository } from '../../payment/repositories/payment.repository';
import { PaymentType } from '@generated/prisma/client';

@Injectable()
export class BillingPaymentListener {
  private readonly logger = new Logger(BillingPaymentListener.name);

  constructor(
    @InjectQueue(QUEUES.PAYMENTS) private readonly paymentQueue: Queue,
    @InjectQueue(QUEUES.BILLING) private readonly billingQueue: Queue, 
    @InjectQueue(QUEUES.NOTIFICATIONS) private readonly notifyQueue: Queue,
    private readonly paymentRepo: PaymentRepository,
  ) {}

  @OnEvent(BILLING_EVENTS.SUBSCRIPTION_CREATED)
  async handleSubscriptionCreated(payload: SubscriptionCreatedEvent) {
    if (payload.billingMode === 'MANUAL') {
      await this.paymentQueue.add(JOB_NAMES.INITIALIZE_SUBSCRIPTION_PAYMENT, payload);
    }
    
    await this.notifyQueue.add(JOB_NAMES.SEND_WELCOME_EMAIL, payload);
  }

  @OnEvent(PAYMENT_EVENTS.PAYMENT_UPDATED)
  async handlePaymentUpdated(event: PaymentUpdatedEvent) {
    const payment = await this.paymentRepo.findById(event.paymentId);
    
    if (payment?.type === PaymentType.SUBSCRIPTION) {
      this.logger.log(`Routing Subscription Sync to BILLING Queue: ${event.paymentId}`);
      
      await this.billingQueue.add(JOB_NAMES.SYNC_SUBSCRIPTION_STATUS, {
        ...event,
        metadata: payment.metadata
      });
    }
  }
}