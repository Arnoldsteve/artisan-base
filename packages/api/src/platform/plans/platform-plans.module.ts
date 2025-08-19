import { Module } from '@nestjs/common';
import { PlatformPlansController } from './platform-plans.controller';
import { PlatformPlansService } from './platform-plans.service';
import { PlatformPlansRepository } from './platform-plans.repository';
import { PLATFORM_PLANS_REPOSITORY } from './interfaces/platform-plans-repository.interface';

@Module({
  controllers: [PlatformPlansController],
  providers: [
    PlatformPlansService,
    {
      provide: PLATFORM_PLANS_REPOSITORY,
      useClass: PlatformPlansRepository,
    },
  ],
  exports: [PlatformPlansService],
})
export class PlatformPlansModule {}