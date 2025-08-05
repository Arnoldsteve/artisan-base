import { Injectable } from '@nestjs/common';
import { Product } from '../interfaces/product.interface';
import { RecommendationStrategy } from './recommendation.strategy';
import { Decimal } from '@prisma/client/runtime/library'; // <-- Import the Decimal type

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

    // --- THIS IS THE CORRECTED LOGIC ---
    
    // Check if prices are valid using Decimal's comparison methods.
    if (!priceA || !priceB || priceA.lessThanOrEqualTo(0) || priceB.lessThanOrEqualTo(0)) {
      return 0;
    }

    // Use .mul() for multiplication to get new Decimal objects.
    const minPrice = priceA.mul(0.5);
    const maxPrice = priceA.mul(1.5);

    // Use .isGreaterThanOrEqualTo() and .isLessThanOrEqualTo() for comparison.
    // The && operator works because these methods return a standard boolean.
    return priceB.greaterThanOrEqualTo(minPrice) && priceB.lessThanOrEqualTo(maxPrice) ? 1 : 0;
  }
}