import {
  Controller,
  Get,
  Query,
  Param,
  ValidationPipe,
  Scope,
} from '@nestjs/common';
import { StorefrontProductService } from './storefront-product.service';
import { GetProductsDto } from './dto/get-products.dto';

@Controller({
  path: 'storefront/products',
  scope: Scope.REQUEST,
})
export class StorefrontProductController {
  constructor(private readonly productService: StorefrontProductService) {}

  @Get()
  findAll(@Query(ValidationPipe) filters: GetProductsDto) {
    console.log('filters', filters);
    return this.productService.findAll(filters);
  }

  @Get('featured')
  async findFeatured() {
    const products = await this.productService.findFeatured();
    return {
      success: true,
      data: products,
      meta: { total: products.length },
    };
  }

  @Get('categories')
  async findCategories() {
    const categories = await this.productService.findCategories();
    return {
      success: true,
      data: categories,
      meta: { total: categories.length },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return { success: true, data: product };
  }
}
