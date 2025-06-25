import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';

@Module({
  imports: [
    TenantPrismaModule, 
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}