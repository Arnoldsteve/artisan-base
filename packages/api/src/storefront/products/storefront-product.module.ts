import { Module, Scope } from '@nestjs/common';
import { StorefrontProductService } from './storefront-product.service';
import { StorefrontProductController } from './storefront-product.controller';
import { StorefrontProductRepository } from './storefront-product.repository'; // <-- IMPORT THE CLASS
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [],
  controllers: [StorefrontProductController],
  providers: [
    StorefrontProductService,
    StorefrontProductRepository,
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
  exports: [StorefrontProductService],
})
export class StorefrontProductModule {}