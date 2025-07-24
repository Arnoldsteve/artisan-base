import {
  Controller,
  Get,
  Query,
  Param,
  ValidationPipe,
  Scope,
  Logger,
} from '@nestjs/common';
import { StorefrontCategoryService } from './storefront-category.service';
import { GetCategoriesDto } from './dto/get-categories.dto';

@Controller({
  path: 'storefront/categories',
  scope: Scope.REQUEST,
})
export class StorefrontCategoryController {
  constructor(private readonly categoryService: StorefrontCategoryService) {}

  // gets all the categoies with there products data
  @Get()
  findAll(@Query(ValidationPipe) filters: GetCategoriesDto) {
    return this.categoryService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(id);
    return { success: true, data: category  };
  }
}
