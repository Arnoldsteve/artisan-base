import { Module, Scope } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { TenantContextService } from 'src/common/tenant-context.service';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
  // Remove `TenantPrismaModule` as our main PrismaModule is now global
  imports: [ProductCategoryModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    { provide: 'ProductRepository', useClass: ProductRepository },
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
  exports: [ProductService, ProductCategoryModule],
})
export class ProductModule {}