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
import { GetTenant } from '@/common/decorators/get-tenant.decorator';

@Controller({
  path: 'storefront/products',
  scope: Scope.REQUEST,
})
export class StorefrontProductController {
  constructor(private readonly productService: StorefrontProductService) {}

  @Get()
  findAll(@Query(ValidationPipe) filters: GetProductsDto,  @GetTenant() tenantId: string) {
    Logger.log(`Tenant ID: ${tenantId}`, 'StorefrontProductController');
    return this.productService.findAll(filters, tenantId);
  }

  @Get('featured')
  async findFeatured(@Query(ValidationPipe) filters: GetFeaturedProductsDto, @Req() req) {
    const tenantId = req.headers['x-tenant-id'];

    return this.productService.findFeatured(filters);
  }

  @Get('categories')
  async findCategories(@Req() req) {
    const tenantId = req.headers['x-tenant-id'];
    return this.productService.findCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return { success: true, data: product };
  }
}
