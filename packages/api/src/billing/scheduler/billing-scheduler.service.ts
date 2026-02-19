import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BillingRepository } from '../repositories/billing.repository';

/**
 * Billing Scheduler.
 * Runs background jobs for:
 * 1. Expiry reminders — 7d, 3d, 1d before expiry (Mpesa manual tenants)
 * 2. Suspension      — after grace period (3 days past expiry)
 *
 * Emits events — notification layer (email/sms) listens to these.
 * Scheduler does NOT send emails directly — Single Responsibility.
 */
@Injectable()
export class BillingSchedulerService {
  private readonly logger = new Logger(BillingSchedulerService.name);
  private readonly GRACE_PERIOD_DAYS = 3;

  constructor(
    private readonly billingRepo: BillingRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─── Reminders ───────────────────────────────────────────────────────────────

  /**
   * Runs every day at 8:00 AM UTC.
   * Finds subscriptions expiring in 7, 3, or 1 day and emits reminders.
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendExpiryReminders(): Promise<void> {
    this.logger.log('⏰ Running expiry reminder job...');

    const reminderWindows = [7, 3, 1];

    for (const days of reminderWindows) {
      try {
        const expiring = await this.billingRepo.findExpiringSubscriptions(days);

        // Filter to only those expiring exactly on this day window
        const exact = expiring.filter((sub) => {
          const daysLeft = this.getDaysUntilExpiry(sub.currentPeriodEnd);
          return daysLeft === days;
        });

        for (const sub of exact) {
          this.eventEmitter.emit('billing.expiry_reminder', {
            tenantId: sub.tenantId,
            tenantName: sub.tenant.name,
            ownerEmail: sub.tenant.owner.email,
            ownerFirstName: sub.tenant.owner.firstName,
            currency: sub.tenant.baseCurrency,
            currentPeriodEnd: sub.currentPeriodEnd,
            daysLeft: days,
          });

          this.logger.log(
            `📧 Expiry reminder emitted | Tenant: ${sub.tenant.name} | Days left: ${days}`,
          );
        }
      } catch (error) {
        this.logger.error(`Reminder job failed for ${days}d window: ${error.message}`);
      }
    }
  }

  // ─── Suspension ──────────────────────────────────────────────────────────────

  /**
   * Runs every day at 9:00 AM UTC.
   * Finds subscriptions expired past grace period and suspends tenants.
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async suspendExpiredTenants(): Promise<void> {
    this.logger.log('⏰ Running suspension job...');

    try {
      const expired = await this.billingRepo.findExpiredSubscriptions(
        this.GRACE_PERIOD_DAYS,
      );

      for (const sub of expired) {
        // Skip already suspended tenants
        if (sub.tenant.status === 'SUSPENDED') continue;

        await this.billingRepo.suspendTenant(sub.tenantId);

        this.eventEmitter.emit('billing.tenant_suspended', {
          tenantId: sub.tenantId,
          tenantName: sub.tenant.name,
          currentPeriodEnd: sub.currentPeriodEnd,
        });

        this.logger.warn(
          `🔴 Tenant SUSPENDED | ${sub.tenant.name} | Expired: ${sub.currentPeriodEnd.toISOString()}`,
        );
      }
    } catch (error) {
      this.logger.error(`Suspension job failed: ${error.message}`);
    }
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  private getDaysUntilExpiry(expiryDate: Date): number {
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}