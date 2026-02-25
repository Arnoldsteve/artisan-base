import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';

/**
 * TOP 1% ARCHITECTURE: Dispatcher Scheduler
 * This service ONLY triggers the background tasks.
 * It prevents multi-server collisions and keeps the API thread free.
 */
@Injectable()
export class BillingSchedulerService {
  private readonly logger = new Logger(BillingSchedulerService.name);

  constructor(
    // We push to the ANALYTICS or a SYSTEM queue for heavy processing
    @InjectQueue(QUEUES.ANALYTICS) private readonly systemQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async triggerExpiryReminders() {
    this.logger.log('⏰ Scheduling Expiry Reminders task...');
    await this.systemQueue.add(JOB_NAMES.HANDLE_EXPIRY_REMINDERS, {}, {
      jobId: `expiry-reminders-${new Date().toISOString().split('T')[0]}`, // Idempotency
      removeOnComplete: true,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async triggerTenantSuspensions() {
    this.logger.log('⏰ Scheduling Tenant Suspensions task...');
    await this.systemQueue.add(JOB_NAMES.HANDLE_TENANT_SUSPENSIONS, {}, {
      jobId: `suspensions-${new Date().toISOString().split('T')[0]}`, // Prevents double-run
      removeOnComplete: true,
    });
  }
}