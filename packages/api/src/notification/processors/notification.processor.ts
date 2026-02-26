import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';
import { NotificationService } from '../notification.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';

/**
 * TOP 1% ARCHITECTURE: Background Notification Processor
 * millions of users: This worker handles the heavy lifting of generating 
 * HTML and communicating with mail servers outside the main API thread.
 */
@Processor(QUEUES.NOTIFICATIONS, {
  limiter: {
    max: 1,
    duration: 5000,
  },
})
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly tenantContext: TenantContextService,
  ) {
    super();
  }

  /**
   * Main entry point for background notification jobs.
   */
  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing Notification Job: ${job.name} [ID: ${job.id}]`);

    switch (job.name) {
      case JOB_NAMES.PROCESS_ORDER_RECEIPT:
        return this.handleCustomerReceipt(job.data);

      case JOB_NAMES.NOTIFY_MERCHANT_NEW_ORDER:
        return this.handleMerchantAlert(job.data);

      default:
        this.logger.warn(`Unhandled notification job name: ${job.name}`);
    }
  }

  /**
   * Handle the consolidated buyer receipt.
   */
  private async handleCustomerReceipt(data: any) {
    try {
      this.logger.debug(`Sending receipt to customer: ${data.customerEmail}`);
      // This logic fetches cross-tenant orders, so it uses the Global context (no .run needed)
      return await this.notificationService.sendCustomerReceipt(data);
    } catch (error) {
      this.logger.error(`Failed to send customer receipt: ${data.paymentReference}`, error.stack);
      throw error; // Triggers BullMQ retry
    }
  }

  /**
   * Handle the individual merchant sale alerts.
   */
  private async handleMerchantAlert(data: any) {
    // 1. RE-ESTABLISH CONTEXT: Required because the notification service 
    // needs to fetch the store 'OWNER' from the isolated database.
    return this.tenantContext.run(data.tenantId, async () => {
      try {
        this.logger.debug(`Sending sale alert to merchant for Order: ${data.orderNumber}`);
        return await this.notificationService.sendMerchantOrderAlert(data);
      } catch (error) {
        this.logger.error(`Failed to send merchant alert: ${data.orderNumber}`, error.stack);
        throw error; // Triggers BullMQ retry
      }
    });
  }
}