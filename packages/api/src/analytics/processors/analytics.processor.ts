import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { PaymentRepository } from '../../payment/repositories/payment.repository';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PaymentUpdatedEvent } from '@/payment/events/payment.events';

/**
 * TOP 1% ARCHITECTURE: Background Analytics Processor
 * millions of users: Handles the CPU-intensive work of updating summary 
 * tables so that merchant dashboards load instantly.
 */
@Processor(QUEUES.ANALYTICS)
export class AnalyticsProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalyticsProcessor.name);

  constructor(
    private readonly analyticsRepo: AnalyticsRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly tenantContext: TenantContextService,
  ) {
    super();
  }

  /**
   * Main entry point for background analytics jobs.
   */
  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing Analytics Job: ${job.name} [ID: ${job.id}]`);

    switch (job.name) {
      case JOB_NAMES.SYNC_ANALYTICS:
        return this.handleRevenueSync(job.data);

      default:
        this.logger.warn(`Unhandled analytics job name: ${job.name}`);
    }
  }

  /**
   * millions of users: Performs atomic increment of daily totals.
   * This ensures the merchant's 'Total Revenue' chart is always up to date.
   */
  private async handleRevenueSync(event: PaymentUpdatedEvent) {
    const { paymentId, tenantId } = event;

    // 1. RE-ESTABLISH CONTEXT: Required for Isolated Database operations
    return this.tenantContext.run(tenantId, async () => {
      try {
        // 2. Fetch the payment record to get the verified amount
        const payment = await this.paymentRepo.findById(paymentId);
        
        if (!payment) {
          this.logger.warn(`Analytics Sync skipped: Payment ${paymentId} not found.`);
          return;
        }

        const amount = Number(payment.amount);

        // 3. TOP 1% LOGIC: Atomic Increment
        // We update the 'AnalyticsDailyRevenue' row for 'Today'
        await this.analyticsRepo.incrementDailyRevenue(tenantId, amount);

        this.logger.log(`Analytics updated for Tenant: ${tenantId} | Added: ${amount}`);
        
        return { status: 'revenue_aggregated', amount };

      } catch (error) {
        this.logger.error(`Analytics sync failed for payment ${paymentId}`, error.stack);
        throw error; // Triggers BullMQ retry/backoff
      }
    });
  }
}