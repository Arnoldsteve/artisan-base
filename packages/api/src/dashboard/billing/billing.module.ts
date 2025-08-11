import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
// Import the PlatformPlansModule to make its exported providers available here
import { PlatformPlansModule } from '../../platform/plans/platform-plans.module';

@Module({
  imports: [
    // By importing this module, we gain access to the PlatformPlansService
    // that it exports.
    PlatformPlansModule,
  ],
  controllers: [BillingController],
})
export class BillingModule {}