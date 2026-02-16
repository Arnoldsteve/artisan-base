import { Global, Module } from '@nestjs/common';
import { TenantRepository } from './repositories/tenant.repository';
import { TenantMemberRepository } from './repositories/tenant-member.repository';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

/**
 * SOLID Principle: Interface Segregation & Dependency Injection
 * This module is responsible for managing Tenant-related data and 
 * access control logic. 
 * 
 * We mark it as @Global() so that any module in the system (like Auth or Products)
 * can easily inject the repositories to verify tenant membership.
 */
@Global()
@Module({
  imports: [],
  controllers: [TenantController], 
  providers: [
    TenantService,                
    TenantRepository,
    TenantMemberRepository,
  ],
  exports: [
    TenantService,
    TenantRepository,
    TenantMemberRepository,
  ],
})
export class TenantModule {}