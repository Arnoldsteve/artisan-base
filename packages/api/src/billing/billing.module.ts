import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { SharedModule } from '../shared/shared.module';
// --- Add these imports ---
import { BillingRepository } from './billing.repository';
import { IBillingRepository } from './interfaces/billing-repository.interface';
import { PlatformPlansModule } from '../platform/plans/platform-plans.module';


@Module({
  imports: [SharedModule, PlatformPlansModule],
  controllers: [BillingController],
  providers: [
    BillingService,
    {
      provide: IBillingRepository,
      useClass: BillingRepository,
    },
  ],
  exports: [BillingService],
})
export class BillingModule {}