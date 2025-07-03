import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';
import { ProductRepository } from './product.repository';

@Module({
  imports: [TenantPrismaModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    { provide: 'ProductRepository', useClass: ProductRepository },
  ],
})
export class ProductModule {}
