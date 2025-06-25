import { Module } from '@nestjs/common';
import { TenantPrismaService } from './tenant-prisma.service';

@Module({
  providers: [TenantPrismaService], // Define the provider
  exports: [TenantPrismaService],   // Export it so other modules can import this module and use the service
})
export class TenantPrismaModule {}