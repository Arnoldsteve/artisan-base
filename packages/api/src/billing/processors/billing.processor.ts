import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';
import { BillingService } from '../billing.service';
import { BillingRepository } from '../repositories/billing.repository';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { SubscriptionCreatedEvent, BILLING_EVENTS } from '../events/billing.events';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * TOP 1% ARCHITECTURE: Background Billing Processor
 * Orchestrates high-latency payments and platform-wide scheduler tasks.
 */
@Processor(QUEUES.PAYMENTS) // Ensure your Scheduler pushes to this same queue
export class BillingProcessor extends WorkerHost {
  private readonly logger = new Logger(BillingProcessor.name);

  constructor(
    private readonly billingService: BillingService,
    private readonly billingRepo: BillingRepository,
    private readonly tenantContext: TenantContextService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  /**
   * Main entry point for background billing jobs.
   */
  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing Billing Job: ${job.name} [ID: ${job.id}]`);

    switch (job.name) {
      case 'INITIALIZE_SUBSCRIPTION_PAYMENT':
        return this.handleSubscriptionInitialization(job.data);

      case JOB_NAMES.HANDLE_EXPIRY_REMINDERS:
        return this.processExpiryReminders();

      case JOB_NAMES.HANDLE_TENANT_SUSPENSIONS:
        return this.processSuspensions();

      default:
        this.logger.warn(`Unhandled billing job name: ${job.name}`);
    }
  }

  /**
   * millions of users: Handled for M-Pesa STK Pushes.
   * If Safaricom is slow, this worker retries automatically via BullMQ backoff.
   */
  private async handleSubscriptionInitialization(data: SubscriptionCreatedEvent) {
    return this.tenantContext.run(data.tenantId, async () => {
      try {
        this.logger.debug(`Triggering ${data.billingMode} sub for Tenant: ${data.tenantId}`);
        return await this.billingService.subscribe({
          planId: data.planId,
          billingCycle: data.billingCycle as any,
          phone: data.phone,
        });
      } catch (error) {
        this.logger.error(`Subscription job failed for tenant ${data.tenantId}`, error.stack);
        throw error; // Triggers BullMQ retry
      }
    });
  }

  /**
   * millions of users: Cross-Tenant Scheduler Task.
   * Scans for subscriptions about to expire and fires events for the notification layer.
   */
  private async processExpiryReminders() {
    this.logger.log('🚀 Executing platform-wide expiry reminders...');
    const windows = [7, 3, 1]; // Days before expiry

    for (const days of windows) {
      // Logic: Uses base client inside repo to look across all merchants
      const expiring = await this.billingRepo.findExpiringSubscriptions(days);
      
      for (const sub of expiring) {
        this.eventEmitter.emit(BILLING_EVENTS.EXPIRY_REMINDER, {
          tenantId: sub.tenantId,
          tenantName: sub.tenant.name,
          ownerEmail: sub.tenant.owner.email,
          ownerFirstName: sub.tenant.owner.firstName,
          currency: sub.tenant.baseCurrency,
          currentPeriodEnd: sub.currentPeriodEnd,
          daysLeft: days,
        });
      }
    }
    return { processed: 'reminders_emitted' };
  }

  /**
   * millions of users: System Safety Task.
   * Automatically suspends stores that have failed to pay after the grace period.
   */
  private async processSuspensions() {
    this.logger.log('🚀 Executing platform-wide tenant suspensions...');
    const gracePeriod = 3; 

    const expired = await this.billingRepo.findExpiredSubscriptions(gracePeriod);

    for (const sub of expired) {
      if (sub.tenant.status === 'SUSPENDED') continue;

      // ATOMIC ACTION: Updates Tenant Status and Subscription Status
      await this.billingRepo.suspendTenant(sub.tenantId);

      this.eventEmitter.emit(BILLING_EVENTS.TENANT_SUSPENDED, {
        tenantId: sub.tenantId,
        tenantName: sub.tenant.name,
        currentPeriodEnd: sub.currentPeriodEnd,
      });

      this.logger.warn(`🔴 Store Suspended: ${sub.tenant.name} (${sub.tenantId})`);
    }
    return { processed: expired.length };
  }
}