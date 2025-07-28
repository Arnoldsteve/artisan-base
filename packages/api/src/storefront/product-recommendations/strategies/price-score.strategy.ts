import { Injectable } from '@nestjs/common';
import { Product } from '../interfaces/product.interface';
import { RecommendationStrategy } from './recommendation.strategy';

@Injectable()
export class PriceScoreStrategy implements RecommendationStrategy {
  /**
   * Calculates a score based on price proximity.
   * Returns 1 if the other product's price is within a 50% band
   * of the current product's price, otherwise 0.
   * @param currentProduct The product being viewed.
   * @param otherProduct The product to score.
   * @returns A score of 0 or 1.
   */
  calculateScore(currentProduct: Product, otherProduct: Product): number {
    const priceA = currentProduct.price;
    const priceB = otherProduct.price;

    if (!priceA || !priceB || priceA <= 0 || priceB <= 0) {
      return 0;
    }

    const minPrice = priceA * 0.5;
    const maxPrice = priceA * 1.5;

    return priceB >= minPrice && priceB <= maxPrice ? 1 : 0;
  }
}