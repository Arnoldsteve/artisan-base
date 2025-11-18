import {
  Controller,
  Get,
  Query,
  Param,
  ValidationPipe,
  Scope,
  Req,
  Logger,
} from '@nestjs/common';
import { StorefrontProductService } from './storefront-product.service';
import { GetProductsDto } from './dto/get-products.dto';
import { GetFeaturedProductsDto } from './dto/get-featured-products';

@Controller({
  path: 'storefront/products',
  scope: Scope.REQUEST,
})
export class StorefrontProductController {
  constructor(private readonly productService: StorefrontProductService) {}

  @Get()
  findAll(@Query(ValidationPipe) filters: GetProductsDto, @Req() req) {
    const tenantId = req.headers['x-tenant-id'];
    return this.productService.findAll(filters, tenantId);
  }

  @Get('featured')
  async findFeatured(@Query(ValidationPipe) filters: GetFeaturedProductsDto, @Req() req) {
    const tenantId = req.headers['x-tenant-id'];

    return this.productService.findFeatured(filters, tenantId);
  }

  @Get('categories')
  async findCategories(@Req() req) {
    const tenantId = req.headers['x-tenant-id'];
    return this.productService.findCategories(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return { success: true, data: product };
  }
}
