import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { PlatformPlansModule } from '../platform/plans/platform-plans.module';
import { BillingService } from './billing.service';
import { BillingRepository } from './billing.repository';
import { IBillingRepository } from './interfaces/billing-repository.interface';

@Module({
  imports: [PlatformPlansModule],
  controllers: [BillingController],
  providers: [
    // The service is request-scoped
    BillingService,
    // Provide the repository using the injection token
    {
      provide: IBillingRepository,
      useClass: BillingRepository,
    },
  ],
})
export class BillingModule11 {}
