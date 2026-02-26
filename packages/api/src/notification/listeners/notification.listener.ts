import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  ORDER_EVENTS,
  CheckoutCompletedEvent,
  OrderCreatedEvent,
} from '../../order/events/order.events';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';

/**
 * SOLID Principle: Single Responsibility
 * This listener acts as a bridge between the Event Emitter and BullMQ.
 * It ensures that notification tasks are offloaded to background workers.
 */
@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(
    // Inject the global notifications queue defined in your QueuesModule
    @InjectQueue(QUEUES.NOTIFICATIONS) private readonly notifyQueue: Queue,
  ) {}

  /**
   * millions of users: Handled when the entire basket checkout is finished.
   * This triggers the consolidated Customer Receipt.
   */
  @OnEvent(ORDER_EVENTS.CHECKOUT_COMPLETED)
  async handleCheckoutCompleted(payload: CheckoutCompletedEvent) {
    this.logger.log(`Queuing customer receipt: ${payload.paymentReference}`);

    await this.notifyQueue.add(JOB_NAMES.PROCESS_ORDER_RECEIPT, payload, {
      // Enterprise Strategy: Emails can fail (SMTP timeout), so we retry.
      attempts: 1, // 3
      backoff: { type: 'exponential', delay: 10000 }, // Wait 10s, then 20s, etc.
      removeOnComplete: true,
      removeOnFail: true,
    });
  }

  /**
   * millions of users: Handled for every merchant's order in the basket.
   * This triggers individual "New Sale" alerts for the artisans.
   */
  @OnEvent(ORDER_EVENTS.ORDER_CREATED)
  async handleOrderCreated(payload: OrderCreatedEvent) {
    this.logger.log(`Queuing merchant sale alert: ${payload.orderNumber}`);

    await this.notifyQueue.add(JOB_NAMES.NOTIFY_MERCHANT_NEW_ORDER, payload, {
      attempts: 1, // 2
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
}
