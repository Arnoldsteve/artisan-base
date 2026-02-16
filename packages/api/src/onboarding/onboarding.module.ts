import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { UserModule } from '../user/user.module';
import { TenantModule } from '../tenant/tenant.module';

/**
 * SOLID Principle: Dependency Inversion / Facade Pattern
 * This module does not "own" the User or Tenant tables. 
 * Instead, it IMPORTS the modules that do, and uses their 
 * exported repositories to build the onboarding flow.
 */
@Module({
  imports: [
    UserModule,   // Access to UserRepository
    TenantModule, // Access to Tenant & Member Repositories
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}