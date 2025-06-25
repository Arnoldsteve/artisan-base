import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TenantPrismaModule } from '../prisma/tenant-prisma.module'; // <-- IMPORT THE NEW MODULE

@Module({
  imports: [
    TenantPrismaModule, 
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}