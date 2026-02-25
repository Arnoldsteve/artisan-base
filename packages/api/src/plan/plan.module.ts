import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PlanRepository } from './repositories/plan.repository';

@Module({
  controllers: [PlanController],
  providers: [
    PlanService,
    PlanRepository,
  ],
  exports: [PlanService], // BillingModule imports this
})
export class PlanModule {}