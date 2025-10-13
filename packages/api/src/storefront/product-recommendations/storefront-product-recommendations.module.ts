import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { StorefrontProductModule } from '../products/storefront-product.module'; // This import is correct
import { StorefontProductRecommendationsController } from './storefront-product-recommendations.controller';
import { StorefontProductRecommendationsService } from './storefront-product-recommendations.service';
import { StorefrontProductRecommendationsRepository } from './storefront-product-recommendations.repository';
// The token should match what the service injects
import { IStorefrontProductRecommendationsRepository } from './interfaces/storefront-product-recommendations-repository.interface';

// --- Import all strategies ---
import { CategoryMatchStrategy } from './strategies/category-match.strategy';
import { TagSimilarityStrategy } from './strategies/tag-similarity.strategy';
import { PriceScoreStrategy } from './strategies/price-score.strategy';
import { PopularityScoreStrategy } from './strategies/popularity-score.strategy';

@Module({
  imports: [
    CacheModule.register(),
    StorefrontProductModule,
  ],
  controllers: [StorefontProductRecommendationsController],
  providers: [
    StorefontProductRecommendationsService,
    StorefrontProductRecommendationsRepository,
    CategoryMatchStrategy,
    TagSimilarityStrategy,
    PriceScoreStrategy,
    PopularityScoreStrategy,
  ],
})
export class StorefontProductRecommendationsModule {}