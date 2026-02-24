import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PaymentUpdatedEvent } from '../../payment/payment.service';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';

/**
 * SOLID Principle: Single Responsibility
 * This listener acts as a 'Bridge'. It catches payment updates from the 
 * infrastructure layer and queues them for the order processing domain.
 */
@Injectable()
export class PaymentStatusListener {
  private readonly logger = new Logger(PaymentStatusListener.name);

  constructor(
    @InjectQueue(QUEUES.ORDER_PROCESSING) private readonly orderQueue: Queue,
  ) {}

  /**
   * millions of users: Handled immediately after a Webhook or manual Verify.
   * We move the complex metadata logic to a BullMQ worker to keep the API responsive.
   */
  @OnEvent('payment.updated')
  async handlePaymentUpdated(event: PaymentUpdatedEvent) {
    this.logger.log(`Bridging Payment Update to Order Queue: ${event.paymentId}`);

    await this.orderQueue.add(
      JOB_NAMES.SYNC_PAYMENT_STATUS, 
      event, // Pass the whole event payload to the worker
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      }
    );
  }
}