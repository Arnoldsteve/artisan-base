import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';
import { BillingRepository } from '../repositories/billing.repository';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { BILLING_EVENTS } from '../events/billing.events';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * TOP 1% ARCHITECTURE: Background Billing Processor
 * millions of users: Handles the high-latency lifecycle tasks of subscriptions.
 */
@Processor(QUEUES.BILLING) 
export class BillingProcessor extends WorkerHost {
  private readonly logger = new Logger(BillingProcessor.name);

  constructor(
    private readonly billingRepo: BillingRepository,
    private readonly tenantContext: TenantContextService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing Billing Job: ${job.name} [ID: ${job.id}]`);

    switch (job.name) {
      case JOB_NAMES.SYNC_SUBSCRIPTION_STATUS:
        return this.handleSubscriptionSync(job.data);

      case JOB_NAMES.HANDLE_EXPIRY_REMINDERS:
        return this.processExpiryReminders();

      case JOB_NAMES.HANDLE_TENANT_SUSPENSIONS:
        return this.processSuspensions();

      default:
        this.logger.warn(`Unhandled billing job name: ${job.name}`);
    }
  }

  /**
   * millions of users: Handled when the Payment Module confirms money has moved.
   * This updates the Tenant's plan and extends their expiration date.
   */
  private async handleSubscriptionSync(data: any) {
    const { tenantId, metadata } = data;

    // 1. Restore context to ensure Prisma Isolation is safe
    return this.tenantContext.run(tenantId, async () => {
      this.logger.log(`Activating subscription for Tenant: ${tenantId}`);

      // 2. ATOMIC ACTION: Update Subscription record and Tenant plan status
      await this.billingRepo.activateSubscription({
        tenantId: tenantId,
        planId: metadata.planId,
        providerSubscriptionId: data.paymentId,
        billingMode: metadata.billingMode || 'MANUAL',
      });

      // 3. Emit success for the notification layer (Email/SMS)
      this.eventEmitter.emit(BILLING_EVENTS.TENANT_REACTIVATED, {
        tenantId,
        newPeriodEnd: new Date(), // Repository calculates the exact 30-day offset
      });

      return { status: 'subscription_activated' };
    });
  }

  /**
   * millions of users: Scans for subscriptions about to expire.
   */
  private async processExpiryReminders() {
    this.logger.log('🚀 Executing platform-wide expiry reminders...');
    const windows = [7, 3, 1];

    for (const days of windows) {
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
   * millions of users: Automatically suspends unpaid stores.
   */
  private async processSuspensions() {
    this.logger.log('🚀 Executing platform-wide tenant suspensions...');
    const gracePeriod = 3; 

    const expired = await this.billingRepo.findExpiredSubscriptions(gracePeriod);

    for (const sub of expired) {
      if (sub.tenant.status === 'SUSPENDED') continue;

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