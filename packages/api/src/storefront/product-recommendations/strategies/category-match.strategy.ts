// src/storefront/product-recommendations/strategies/category-match.strategy.ts
import { Injectable, Logger } from '@nestjs/common';
import { RecommendationStrategy } from './recommendation.strategy';
import { Product } from '../interfaces/product.interface';


@Injectable()
export class CategoryMatchStrategy implements RecommendationStrategy {
  /**
   * Calculates a score based on shared categories.
   * Returns 1 if the products share at least one category, otherwise 0.
   * @param currentProduct The product being viewed.
   * @param otherProduct The product to score.
   * @returns A score of 0 or 1.
   */
  calculateScore(currentProduct: Product, otherProduct: Product): number {
    const currentCategories = currentProduct.categories || [];
    const otherCategories = otherProduct.categories || [];

    if (currentCategories.length === 0 || otherCategories.length === 0) {
      return 0;
    }

    // Create a Set of category IDs for efficient lookup
    const currentCategoryIds = new Set(currentCategories.map(c => c.id));
    Logger.log(`Current product categories: ${Array.from(currentCategoryIds).join(', ')}`, CategoryMatchStrategy.name);

    // Check if any of the other product's category IDs exist in the current product's set
    for (const otherCat of otherCategories) {
      if (currentCategoryIds.has(otherCat.id)) {
        return 1; // Found a match, no need to check further
      }
    }

    return 0; // No common categories found
  }
}