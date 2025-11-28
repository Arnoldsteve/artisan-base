import { Module, Scope } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository'; 
import { TenantContextService } from 'src/common/tenant-context.service';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
  imports: [ProductCategoryModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}