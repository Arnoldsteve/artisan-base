import {
  Controller,
  Get,
  Query,
  Param,
  ValidationPipe,
  Scope,
  Req,
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
  findAll(@Query(ValidationPipe) filters: GetProductsDto, @Req() req) {
    const tenantId = req.headers['x-tenant-id'];
    return this.productService.findAll(filters, tenantId);
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
  async findCategories(@Req() req) {
    const tenantId = req.headers['x-tenant-id'];
    return  this.productService.findCategories(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return { success: true, data: product };
  }
}
