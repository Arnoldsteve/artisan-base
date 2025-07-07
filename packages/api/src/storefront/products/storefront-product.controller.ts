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
  path: 'v1/storefront/products',
  scope: Scope.REQUEST,
})
export class StorefrontProductController {
  constructor(private readonly productService: StorefrontProductService) {}

  @Get()
  findAll(@Query(ValidationPipe) filters: GetProductsDto) {
    return this.productService.findAll(filters);
  }

  @Get('featured')
  findFeatured() {
    return this.productService.findFeatured();
  }

  @Get('categories')
  findCategories() {
    return this.productService.findCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}
