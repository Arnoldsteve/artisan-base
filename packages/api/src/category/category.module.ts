import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryController } from './category.controller';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
