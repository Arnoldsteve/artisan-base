import { Product } from '../interfaces/product.interface';

export const IStorefrontProductRecommendationsRepository =
  'IStorefrontProductRecommendationsRepository';

export interface IStorefrontProductRecommendationsRepository {
  getRecommendations(productId: string, tenantId:string): Promise<Product[]>;
}