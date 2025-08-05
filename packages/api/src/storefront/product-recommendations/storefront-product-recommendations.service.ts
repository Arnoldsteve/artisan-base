import { Injectable, Scope, Inject, Logger } from '@nestjs/common';
import { 
  IStorefrontProductRecommendationsRepository 
} from './interfaces/storefront-product-recommendations-repository.interface';

@Injectable({ scope: Scope.REQUEST })
export class StorefontProductRecommendationsService {
  constructor(
    @Inject(IStorefrontProductRecommendationsRepository) // Inject using the interface token
    private readonly recommendationsRepository: IStorefrontProductRecommendationsRepository,
  ) {}

  /**
   * Delegates the call to the repository to get product recommendations.
   * @param productId The ID of the product.
   * @returns A list of recommended products.
   */
  async getRecommendations(productId: string) {
    Logger.log(`Fetching recommendations for product ID: ${productId}`, StorefontProductRecommendationsService.name);
    return this.recommendationsRepository.getRecommendations(productId);
  }
}