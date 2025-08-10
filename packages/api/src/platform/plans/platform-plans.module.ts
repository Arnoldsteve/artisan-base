import { Module } from '@nestjs/common';
import { PlatformPlansController } from './platform-plans.controller';
import { PlatformPlansService } from './platform-plans.service';
import { PlatformPlansRepository } from './platform-plans.repository';
import { PLATFORM_PLANS_REPOSITORY } from './interfaces/platform-plans-repository.interface';

@Module({
  controllers: [PlatformPlansController],
  providers: [
    PlatformPlansService,
    // This tells NestJS: "When someone asks for PLATFORM_PLANS_REPOSITORY,
    // provide them with an instance of PlatformPlansRepository."
    {
      provide: PLATFORM_PLANS_REPOSITORY,
      useClass: PlatformPlansRepository,
    },
  ],
})
export class PlatformPlansModule {}