import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';
import { PAYMENT_EVENTS, PaymentUpdatedEvent } from '@/payment/events/payment.events';

/**
 * SOLID Principle: Single Responsibility
 * Bridges payment.updated events to the BillingQueue.
 * Only processes payments with SUB: reference prefix.
 */
@Injectable()
export class BillingPaymentListener {
  private readonly logger = new Logger(BillingPaymentListener.name);

  constructor(
    @InjectQueue(QUEUES.BILLING) private readonly billingQueue: Queue,
  ) {}

  @OnEvent(PAYMENT_EVENTS.PAYMENT_UPDATED)
  async handlePaymentUpdated(event: PaymentUpdatedEvent) {
    // Only handle subscription payments
    if (!event.reference?.startsWith('SUB:')) return;

    this.logger.log(`Bridging subscription payment to Billing Queue | Ref: ${event.reference}`);

    await this.billingQueue.add(
      JOB_NAMES.SYNC_SUBSCRIPTION_STATUS,
      event,
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        removeOnFail: false, // Keep failed jobs for inspection
      },
    );
  }
}