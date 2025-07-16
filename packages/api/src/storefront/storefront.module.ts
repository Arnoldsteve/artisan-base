import { Module } from '@nestjs/common';
import { StorefrontProductModule } from './products/storefront-product.module';
import { StorefrontCategoryModule } from './categories/storefront-category.module';
import { StorefrontOrderModule } from './orders/storefront-order.module';

@Module({
  imports: [
    StorefrontProductModule,
    StorefrontCategoryModule,
    StorefrontOrderModule,
  ],
})
export class StorefrontModule {}
