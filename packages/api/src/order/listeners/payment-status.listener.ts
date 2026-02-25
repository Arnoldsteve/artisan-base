import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';
import {
  PAYMENT_EVENTS,
  PaymentUpdatedEvent,
} from '@/payment/events/payment.events';
import { PaymentRepository } from '@/payment/repositories/payment.repository';
import { PaymentType } from '@generated/prisma/client';

@Injectable()
export class PaymentStatusListener {
  private readonly logger = new Logger(PaymentStatusListener.name);

  constructor(
    @InjectQueue(QUEUES.ORDER_PROCESSING) private readonly orderQueue: Queue,
    private readonly paymentRepo: PaymentRepository,
  ) {}

  @OnEvent(PAYMENT_EVENTS.PAYMENT_UPDATED)
  async handlePaymentUpdated(event: PaymentUpdatedEvent) {
    const payment = await this.paymentRepo.findById(event.paymentId);

    if (payment?.type === PaymentType.ORDER) {
      this.logger.log(`Bridging Order Payment Update: ${event.paymentId}`);

      await this.orderQueue.add(JOB_NAMES.SYNC_PAYMENT_STATUS, event, {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      });
    }
  }
}
