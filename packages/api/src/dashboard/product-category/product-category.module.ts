import { Module } from '@nestjs/common';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryRepository } from './product-category.repository';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';

@Module({
  imports: [TenantPrismaModule],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, ProductCategoryRepository],
  exports: [ProductCategoryService, ProductCategoryRepository],
})
export class ProductCategoryModule {}
