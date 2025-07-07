import { Module } from '@nestjs/common';
import { StorefrontProductModule } from './products/storefront-product.module';
import { StorefrontCategoryModule } from './categories/storefront-category.module';

@Module({
  imports: [StorefrontProductModule, StorefrontCategoryModule],
})
export class StorefrontModule {}
