import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { BillingRepository } from './repositories/billing.repository';
import { SubscriptionProviderRegistry } from './providers/subscription-provider.registry';
import { StripeSubscriptionProvider } from './providers/stripe-subscription.provider';
import { MpesaSubscriptionProvider } from './providers/mpesa-subscription.provider';
import { BillingSchedulerService } from './scheduler/billing-scheduler.service';
import { PaymentModule } from '@/payment/payment.module';
import { PlanModule } from '@/plan/plan.module';

/**
 * Billing Module.
 * Owns: subscription lifecycle, plan management, scheduler, webhooks.
 * Imports PaymentModule — delegates actual money movement to it.
 * Emits business events — notification layer listens externally.
 */
@Module({
  imports: [
    ScheduleModule.forRoot(), // Required for @Cron decorators
    ConfigModule,
    PaymentModule,            // MpesaSubscriptionProvider needs PaymentService
    PlanModule,

  ],
  controllers: [BillingController],
  providers: [
    // Core
    BillingService,
    BillingRepository,

    // Registry — must be before providers
    SubscriptionProviderRegistry,

    // Providers — self-register via onModuleInit
    StripeSubscriptionProvider,
    MpesaSubscriptionProvider,

    // Scheduler
    BillingSchedulerService,
  ],
  exports: [BillingService],
})
export class BillingModule {}