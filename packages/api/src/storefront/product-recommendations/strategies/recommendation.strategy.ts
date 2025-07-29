import { Product } from '../interfaces/product.interface';

export interface RecommendationStrategy {
  calculateScore(currentProduct: Product, otherProduct: Product): number;
}