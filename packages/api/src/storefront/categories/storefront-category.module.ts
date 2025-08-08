import { Module, Scope } from '@nestjs/common';
import { StorefrontCategoryService } from './storefront-category.service';
import { StorefrontCategoryController } from './storefront-category.controller';
import { StorefrontCategoryRepository } from './storefront-category.repository';
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [],
  controllers: [StorefrontCategoryController],
  providers: [
    StorefrontCategoryService,
    {
      provide: 'StorefrontCategoryRepository',
      useClass: StorefrontCategoryRepository,
    },
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
})
export class StorefrontCategoryModule {}
