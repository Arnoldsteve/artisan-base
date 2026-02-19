import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TenantContextModule } from '../common/tenant-context/tenant-context.module';
import { CommonCacheModule } from '../common/cache/common-cache.module';

@Global() // Usually Prisma is global too
@Module({
  imports: [
    TenantContextModule, 
    CommonCacheModule // Explicitly import here as well to satisfy the dependency
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}