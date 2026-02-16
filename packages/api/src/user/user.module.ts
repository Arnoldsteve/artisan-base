import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

/**
 * SOLID Principle: Single Responsibility
 * This module is the single source of truth for global User accounts.
 */
@Module({
  providers: [UserRepository],
  exports: [UserRepository], // Exported so Onboarding and Auth can use it
})
export class UserModule {}