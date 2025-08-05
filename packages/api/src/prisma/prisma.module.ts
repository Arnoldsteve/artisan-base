import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service'; // For the management DB
import { TenantClientFactory } from './tenant-client-factory.service'; // Our singleton factory
import { TenantPrismaService } from './tenant-prisma.service'; // Our request-scoped service

@Global()
@Module({
  providers: [
    PrismaService,         // Singleton for management DB
    TenantClientFactory,   // Singleton factory for all tenant DBs
    TenantPrismaService,   // Request-scoped service to get the correct tenant client
  ],
  exports: [
    PrismaService,
    TenantClientFactory,
    TenantPrismaService,
  ],
})
export class PrismaModule {}