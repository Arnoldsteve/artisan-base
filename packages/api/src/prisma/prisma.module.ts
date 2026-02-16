import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TenantContextModule } from '../common/tenant-context/tenant-context.module';

/**
 * SOLID Principle: Dependency Inversion
 * By making this module Global, we ensure a single database connection pool 
 * is used throughout the application while injecting the Tenant Context 
 * into every database operation.
 */
@Global()
@Module({
  imports: [TenantContextModule], // Injects the AsyncLocalStorage infrastructure
  providers: [PrismaService],
  exports: [PrismaService], // Exported so every other module can use this.prisma.client
})
export class PrismaModule {}