import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { BillingRepository } from './repositories/billing.repository';
import { BillingSchedulerService } from './scheduler/billing-scheduler.service';
import { PaymentModule } from '@/payment/payment.module';
import { PlanModule } from '@/plan/plan.module';
import { BillingPaymentListener } from './listeners/billing-payment.listener';
import { BillingProcessor } from './processors/billing.processor';

/**
 * millions of users: Clean Domain Module.
 * Since QueuesModule is @Global, we don't need to import BullModule.registerQueue here.
 * The listeners just use @InjectQueue(QUEUES.PAYMENTS).
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    PaymentModule,
    PlanModule,
  ],
  controllers: [BillingController],
  providers: [
    BillingService,
    BillingRepository,
    BillingSchedulerService,
    BillingPaymentListener,
    BillingProcessor,
  ],
  exports: [BillingService],
})
export class BillingModule {}