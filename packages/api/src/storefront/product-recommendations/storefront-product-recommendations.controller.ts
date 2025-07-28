// C:\...\api\src\storefront\product-recommendations\storefront-product-recommendations.controller.ts
import { Controller, Get, Logger, Param, Scope, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
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
  @CacheTTL(3600)
  getRecommendations(
    @Param() params: GetProductRecommendationsDto,
  ): Promise<Product[]> {
    Logger.log(`Fetching recommendations for product ID: ${params.id}`, StorefontProductRecommendationsController.name);
    return this.recommendationsService.getRecommendations(params.id);
  }
}
