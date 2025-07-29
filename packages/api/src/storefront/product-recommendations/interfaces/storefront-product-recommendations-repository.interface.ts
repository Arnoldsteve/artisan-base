import { Product } from '../interfaces/product.interface';

export const IStorefrontProductRecommendationsRepository =
  'IStorefrontProductRecommendationsRepository';

export interface IStorefrontProductRecommendationsRepository {
  /**
   * Generates a list of recommended products based on a given product ID.
   * @param productId The ID of the product to get recommendations for.
   * @returns A promise that resolves to an array of recommended products.
   */
  getRecommendations(productId: string): Promise<Product[]>;
}