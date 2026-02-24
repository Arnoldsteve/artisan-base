import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ORDER_EVENTS, CheckoutCompletedEvent, OrderCreatedEvent } from '../events/order.events';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';

@Injectable()
export class OrderListener {
  private readonly logger = new Logger(OrderListener.name);

  constructor(
    // 1. We use the Centralized Enum for Injection
    @InjectQueue(QUEUES.ORDER_PROCESSING) private readonly orderQueue: Queue,
    @InjectQueue(QUEUES.NOTIFICATIONS) private readonly notifyQueue: Queue,
    @InjectQueue(QUEUES.PAYMENTS) private readonly paymentQueue: Queue,
  ) {}

  @OnEvent(ORDER_EVENTS.CHECKOUT_COMPLETED)
  async handleCheckoutCompleted(payload: CheckoutCompletedEvent) {
    this.logger.log(`Routing Global Checkout to Queues: ${payload.paymentReference}`);

    // 2. Use Centralized Job Names
    await this.notifyQueue.add(JOB_NAMES.PROCESS_ORDER_RECEIPT, payload);

    await this.paymentQueue.add(JOB_NAMES.INITIALIZE_CHECKOUT_PAYMENT, payload, {
      priority: 1, // Payments are always priority 1
    });
  }

  @OnEvent(ORDER_EVENTS.ORDER_CREATED)
  async handleOrderCreated(payload: OrderCreatedEvent) {
    this.logger.log(`Routing Store Order to Queues: ${payload.orderNumber}`);

    // Notify the specific Artisan/Merchant
    await this.notifyQueue.add(JOB_NAMES.NOTIFY_MERCHANT_NEW_ORDER, payload);

    // Start background processing (Inventory, etc.)
    await this.orderQueue.add(JOB_NAMES.PROCESS_VENDOR_ORDER, payload);
  }
}