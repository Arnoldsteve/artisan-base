import { Injectable } from '@nestjs/common';
import { Product } from '../interfaces/product.interface';
import { RecommendationStrategy } from './recommendation.strategy';

@Injectable()
export class TagSimilarityStrategy implements RecommendationStrategy {
  /**
   * Calculates a score based on the similarity of product tags.
   * Uses the Jaccard index: (intersection of tags) / (union of tags).
   * @param currentProduct The product being viewed.
   * @param otherProduct The product to score.
   * @returns A score from 0 to 1.
   */
  calculateScore(currentProduct: Product, otherProduct: Product): number {
    const tagsA = currentProduct.tags || [];
    const tagsB = otherProduct.tags || [];

    if (tagsA.length === 0 || tagsB.length === 0) {
      return 0;
    }

    const setA = new Set(tagsA);
    const setB = new Set(tagsB);

    const intersection = new Set([...setA].filter((tag) => setB.has(tag)));
    const union = new Set([...setA, ...setB]);

    if (union.size === 0) {
      return 0;
    }

    return intersection.size / union.size;
  }
}