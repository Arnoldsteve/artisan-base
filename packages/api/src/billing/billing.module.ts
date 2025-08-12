import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { SharedModule } from '../shared/shared.module';
// --- Add these imports ---
import { BillingRepository } from './billing.repository';
import { IBillingRepository } from './interfaces/billing-repository.interface';

@Module({
  imports: [SharedModule],
  controllers: [BillingController],
  providers: [
    BillingService,
    // --- Add this provider configuration ---
    {
      provide: IBillingRepository,
      useClass: BillingRepository,
    },
  ],
  exports: [BillingService],
})
export class BillingModule {}