import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PaymentStatus } from '@generated/prisma/client';
import { PaymentUpdatedEvent } from '@/payment/events/payment.events';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';

/**
 * SOLID Principle: Single Responsibility
 * This listener bridges the gap between raw payment facts and 
 * the analytics pre-aggregation engine.
 */
@Injectable()
export class AnalyticsListener {
  private readonly logger = new Logger(AnalyticsListener.name);

  constructor(
    @InjectQueue(QUEUES.ANALYTICS) private readonly analyticsQueue: Queue,
  ) {}

  /**
   * millions of users: Handled when any payment status changes.
   * Logic: We only care when money is officially 'PAID' to update revenue charts.
   */
  @OnEvent('payment.updated')
  async handlePaymentUpdated(event: PaymentUpdatedEvent) {
    if (event.status === PaymentStatus.PAID) {
      this.logger.log(`Bridging PAID status to Analytics Queue: ${event.paymentId}`);

      await this.analyticsQueue.add(
        JOB_NAMES.SYNC_ANALYTICS, 
        event, 
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: true, // Scale tip: Keep Redis memory clean
        }
      );
    }
  }
}