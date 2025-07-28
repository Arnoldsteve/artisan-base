import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { StorefrontProductModule } from '../products/storefront-product.module';
import { StorefontProductRecommendationsController } from './storefront-product-recommendations.controller';
import { StorefontProductRecommendationsService } from './storefront-product-recommendations.service';
import { StorefrontProductRecommendationsRepository } from './storefront-product-recommendations.repository';
import { IStorefrontProductRecommendationsRepository } from './interfaces/storefront-product-recommendations-repository.interface';

// --- Import all strategies ---
import { CategoryMatchStrategy } from './strategies/category-match.strategy';
import { TagSimilarityStrategy } from './strategies/tag-similarity.strategy';
import { PriceScoreStrategy } from './strategies/price-score.strategy';
import { PopularityScoreStrategy } from './strategies/popularity-score.strategy';

@Module({
  imports: [
    CacheModule.register(), // Caching is still highly recommended
    StorefrontProductModule, // Required to inject the StorefrontProductRepository
  ],
  controllers: [StorefontProductRecommendationsController],
  providers: [
    StorefontProductRecommendationsService,
    {
      provide: IStorefrontProductRecommendationsRepository,
      useClass: StorefrontProductRecommendationsRepository,
    },
    // Register all strategies so they can be injected into the repository
    CategoryMatchStrategy,
    TagSimilarityStrategy,
    PriceScoreStrategy,
    PopularityScoreStrategy,
  ],
})
export class StorefontProductRecommendationsModule {}