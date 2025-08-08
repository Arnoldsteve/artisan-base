import { Module, Scope } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { ICategoryRepository } from './interfaces/category-repository.interface';
import { TenantContextService } from 'src/common/tenant-context.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
  imports: [ProductCategoryModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: ICategoryRepository,
      useClass: CategoryRepository,
    },
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
    ProductCategoryService,
  ],
})
export class CategoryModule {}
