import {
  Controller,
  Get,
  Query,
  Param,
  ValidationPipe,
  Scope,
} from '@nestjs/common';
import { StorefrontCategoryService } from './storefront-category.service';
import { GetCategoriesDto } from './dto/get-categories.dto';

@Controller({
  path: 'storefront/categories',
  scope: Scope.REQUEST,
})
export class StorefrontCategoryController {
  constructor(private readonly categoryService: StorefrontCategoryService) {}

  @Get()
  findAll(@Query(ValidationPipe) filters: GetCategoriesDto) {
    return this.categoryService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
