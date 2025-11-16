import {
  Controller,
  Get,
  Query,
  Param,
  ValidationPipe,
  Scope,
  Logger,
  Req,
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
  findAll(@Query(ValidationPipe) filters: GetCategoriesDto, @Req() req) {
    const tenantId = req.headers['x-tenant-id'];
    return this.categoryService.findAll(filters, tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(id);
    return { success: true, data: category  };
  }
}
