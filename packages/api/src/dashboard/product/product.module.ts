import { Module, Scope } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';
import { ProductRepository } from './product.repository';
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [TenantPrismaModule],
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
})
export class ProductModule {}
