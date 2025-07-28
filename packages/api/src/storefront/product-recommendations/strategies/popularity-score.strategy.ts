import { Injectable } from '@nestjs/common';
import { Product } from '../interfaces/product.interface';
import { RecommendationStrategy } from './recommendation.strategy';
import { RECOMMENDATION_NORMALIZATION_FACTOR } from '../constants';


@Injectable()
export class PopularityScoreStrategy implements RecommendationStrategy {
  /**
   * Calculates a normalized popularity score for a product.
   * The score is based on the product's rating and review count.
   * Note: This score is independent of the currentProduct.
   * @param currentProduct The product being viewed (not used in this calculation).
   * @param otherProduct The product to score.
   * @returns A normalized score, capped at 1.
   */
  calculateScore(currentProduct: Product, otherProduct: Product): number {
    const rating = otherProduct.rating || 0;
    const reviewCount = otherProduct.reviewCount || 0;

    if (rating === 0 || reviewCount === 0) {
      return 0;
    }

    const rawScore = rating * reviewCount;

    // Normalize the score to a value between 0 and 1
    return Math.min(1, rawScore / RECOMMENDATION_NORMALIZATION_FACTOR);
  }
}