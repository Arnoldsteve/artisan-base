import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';
import { PrismaService } from '@/prisma/prisma.service';
import { PaymentStatus, OrderStatus } from '@generated/prisma/client';
import { PaymentUpdatedEvent } from '@/payment/events/payment.events';

/**
 * TOP 1% ARCHITECTURE: Background Order Processor
 * Handles heavy-duty order orchestration, inventory logic, and 
 * cross-tenant status synchronization.
 */
@Processor(QUEUES.ORDER_PROCESSING)
export class OrderProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(
    private readonly prisma: PrismaService, // Base client for cross-tenant writes
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case JOB_NAMES.SYNC_PAYMENT_STATUS:
        return this.handlePaymentSync(job.data);

      case 'PROCESS_VENDOR_ORDER':
        // Placeholder for future inventory/fulfillment logic
        return;

      default:
        this.logger.warn(`Unknown job: ${job.name}`);
    }
  }

  /**
   * millions of users: Cross-Tenant Logic
   * We use the base Prisma client here to "bypass" isolation.
   * This allows one global payment to unlock orders across multiple store bubbles.
   */
  private async handlePaymentSync(event: PaymentUpdatedEvent) {
    const { paymentId, status } = event;
    this.logger.log(`Syncing payment ${status} for IDs in Payment: ${paymentId}`);

    // 1. Fetch the payment record globally (Base Client)
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || !payment.metadata) {
      this.logger.warn(`Sync failed: Payment ${paymentId} has no metadata/orderIds`);
      return;
    }

    const orderIds: string[] = (payment.metadata as any).orderIds || [];

    // 2. Logic: If PAID, update all orders across all tenants
    if (status === PaymentStatus.PAID) {
      this.logger.debug(`Mass-updating ${orderIds.length} orders to PAID/PROCESSING`);

      /**
       * TOP 1% SCALE TIP: 
       * We use 'updateMany' on the base client. This is atomic and 
       * ignores the tenant bubble, which is exactly what a system-level
       * reconciliation task needs.
       */
      await this.prisma.order.updateMany({
        where: { id: { in: orderIds } },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.PROCESSING,
        },
      });
      
      this.logger.log(`Successfully unlocked ${orderIds.length} orders for merchants.`);
    }
    
    return { processed: orderIds.length };
  }
}