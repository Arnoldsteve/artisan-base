import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';

@Module({
  imports: [TenantPrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
