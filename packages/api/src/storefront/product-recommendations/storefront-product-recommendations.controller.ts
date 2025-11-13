import {
  Controller,
  Get,
  Param,
  Req,
  Scope,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { StorefontProductRecommendationsService } from './storefront-product-recommendations.service';
import { Product } from './interfaces/product.interface';
import { GetProductRecommendationsDto } from './dto/get-product-recommendations.dto';

@Controller({
  path: 'storefront/products',
  scope: Scope.REQUEST,
})
@UseInterceptors(CacheInterceptor)
export class StorefontProductRecommendationsController {
  constructor(
    private readonly recommendationsService: StorefontProductRecommendationsService,
  ) {}

  @Get(':id/recommendations')
  getRecommendations(
    @Param() params: GetProductRecommendationsDto,
    @Req() req,
  ): Promise<Product[]> {
    const tenantId = req.headers['x-tenant-id'];
    Logger.log(
      `Fetching recommendations for product ID: ${params.id} and tenantId: ${tenantId}`,
      StorefontProductRecommendationsController.name,
    );

    return this.recommendationsService.getRecommendations(params.id, tenantId);
  }
}
