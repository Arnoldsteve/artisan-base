import { Module, Scope } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';
import { CategoryRepository } from './category.repository';
import { ICategoryRepository } from './interfaces/category-repository.interface';
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [TenantPrismaModule],
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
  ],
})
export class CategoryModule {}
