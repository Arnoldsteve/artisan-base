import { Module, Scope } from '@nestjs/common';
import { StorefrontProductService } from './storefront-product.service';
import { StorefrontProductController } from './storefront-product.controller';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';
import { StorefrontProductRepository } from './storefront-product.repository';
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [TenantPrismaModule],
  controllers: [StorefrontProductController],
  providers: [
    StorefrontProductService,
    {
      provide: 'StorefrontProductRepository',
      useClass: StorefrontProductRepository,
    },
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
  exports: [StorefrontProductService],
})
export class StorefrontProductModule {}
