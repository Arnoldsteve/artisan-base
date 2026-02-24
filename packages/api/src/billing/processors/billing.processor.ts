import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES, JOB_NAMES } from '../../common/queues/queue.constants';
import { PrismaService } from '@/prisma/prisma.service';
import { PaymentStatus, TenantStatus, SubscriptionStatus } from '@generated/prisma/client';
import { PaymentUpdatedEvent } from '@/payment/events/payment.events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BILLING_EVENTS } from '../events/billing.events';

/**
 * Background Billing Processor.
 * Handles subscription activation, renewal, and failure logic.
 * Uses base Prisma client — operates outside tenant bubble.
 */
@Processor(QUEUES.BILLING)
export class BillingProcessor extends WorkerHost {
  private readonly logger = new Logger(BillingProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case JOB_NAMES.SYNC_SUBSCRIPTION_STATUS:
        return this.handleSubscriptionSync(job.data);

      default:
        this.logger.warn(`Unknown billing job: ${job.name}`);
    }
  }

  private async handleSubscriptionSync(event: PaymentUpdatedEvent) {
    const { tenantId, paymentId, reference, status } = event;

    this.logger.log(`Syncing subscription | Tenant: ${tenantId} | Status: ${status} | Ref: ${reference}`);

    // 1. Parse planId from reference — SUB:tenantId:planId:timestamp
    const parts = reference.split(':');
    const planId = parts[2];

    if (!planId) {
      this.logger.warn(`Could not parse planId from reference: ${reference}`);
      return;
    }

    // 2. Handle PAID → Activate subscription
    if (status === PaymentStatus.PAID) {
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

      await this.prisma.$transaction([
        // Upsert subscription
        this.prisma.tenantSubscription.upsert({
          where: { tenantId },
          create: {
            tenantId,
            providerSubscriptionId: reference,
            status: SubscriptionStatus.ACTIVE,
            currentPeriodEnd,
          },
          update: {
            providerSubscriptionId: reference,
            status: SubscriptionStatus.ACTIVE,
            currentPeriodEnd,
          },
        }),

        // Activate tenant + set plan
        this.prisma.tenant.update({
          where: { id: tenantId },
          data: {
            planId,
            status: TenantStatus.ACTIVE,
          },
        }),
      ]);

      this.logger.log(`Subscription ACTIVATED | Tenant: ${tenantId} | Plan: ${planId}`);

      this.eventEmitter.emit(BILLING_EVENTS.SUBSCRIPTION_CREATED, {
        tenantId,
        planId,
        currentPeriodEnd,
      });

      return { activated: true };
    }

    // 3. Handle FAILED → Mark subscription as UNPAID
    if (status === PaymentStatus.FAILED) {
      await this.prisma.tenantSubscription.updateMany({
        where: { tenantId },
        data: { status: SubscriptionStatus.UNPAID },
      });

      this.logger.warn(`Subscription payment FAILED | Tenant: ${tenantId}`);

      this.eventEmitter.emit(BILLING_EVENTS.SUBSCRIPTION_PAST_DUE, {
        tenantId,
        planId,
      });

      return { activated: false };
    }
  }
}