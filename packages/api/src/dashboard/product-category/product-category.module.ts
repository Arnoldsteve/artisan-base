import { Module } from '@nestjs/common';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryRepository } from './product-category.repository';

@Module({
  imports: [],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, ProductCategoryRepository],
  exports: [ProductCategoryService, ProductCategoryRepository],
})
export class ProductCategoryModule {}
