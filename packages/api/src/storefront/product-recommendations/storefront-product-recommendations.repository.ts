import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { StorefrontProductService } from '../products/storefront-product.service'; // This is correct
import { Product } from './interfaces/product.interface';
import { IStorefrontProductRecommendationsRepository } from './interfaces/storefront-product-recommendations-repository.interface';
import { CategoryMatchStrategy } from './strategies/category-match.strategy';
import { TagSimilarityStrategy } from './strategies/tag-similarity.strategy';
import { PriceScoreStrategy } from './strategies/price-score.strategy';
import { PopularityScoreStrategy } from './strategies/popularity-score.strategy';
import * as RECOMMENDATION from './constants';
import { Decimal } from '@prisma/client/runtime/library';

type ScoredProduct = Product & { _score: number };

@Injectable()
export class StorefrontProductRecommendationsRepository
  implements IStorefrontProductRecommendationsRepository
{
  constructor(
    // This is the correct dependency - the service layer.
    private readonly productsService: StorefrontProductService,
    private readonly categoryStrategy: CategoryMatchStrategy,
    private readonly tagStrategy: TagSimilarityStrategy,
    private readonly priceStrategy: PriceScoreStrategy,
    private readonly popularityStrategy: PopularityScoreStrategy,
  ) {}

  async getRecommendations(productId: string): Promise<Product[]> {
    // 1. Fetch all necessary data. This part of your code is already correct.
    const [allProductsResponse, currentProduct] = await Promise.all([
      this.productsService.findAll({ limit: 1000 }),
      this.productsService.findOne(productId),
    ]);

    if (!currentProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // --- IMPORTANT FIX ---
    // The data coming from your service has Decimal prices. Your local interface expects Decimals.
    // We just need to ensure the type assertions are correct.
    const allProducts = allProductsResponse.data as any[];
    Logger.log(`Total products fetched: ${allProducts.length}`, StorefrontProductRecommendationsRepository.name);
    
    let scored: ScoredProduct[] = allProducts
      .filter((p) => p.id !== productId)
      .map((p) => {
        // Here, both currentProduct and p have Decimal prices, so it works.
        const score = this.calculateTotalScore(currentProduct, p);
        return { ...p, _score: score };
      })
      .filter((p) => p._score > RECOMMENDATION.RECOMMENDATION_MINIMUM_SCORE)
      .sort((a, b) => b._score - a._score);

    scored = this.applyFallbackLogic(scored, allProducts, currentProduct);
    Logger.log(`Scored products after fallback logic: ${scored.length}`, StorefrontProductRecommendationsRepository.name);
    
    return this.finalizeRecommendations(scored);
  }

  // Your helper methods (calculateTotalScore, applyFallbackLogic, etc.) do not need to change
  // as long as your Product interface correctly uses the Decimal type.
  private calculateTotalScore(current: Product, other: Product): number {
    const categoryScore = this.categoryStrategy.calculateScore(current, other);
    const tagScore = this.tagStrategy.calculateScore(current, other);
    const priceScore = this.priceStrategy.calculateScore(current, other);
    const popScore = this.popularityStrategy.calculateScore(current, other);

    return (
      categoryScore * RECOMMENDATION.RECOMMENDATION_WEIGHT_CATEGORY +
      tagScore * RECOMMENDATION.RECOMMENDATION_WEIGHT_TAGS +
      priceScore * RECOMMENDATION.RECOMMENDATION_WEIGHT_PRICE +
      popScore * RECOMMENDATION.RECOMMENDATION_WEIGHT_POPULARITY
    );
  }

  private applyFallbackLogic(
    scored: ScoredProduct[],
    allProducts: Product[],
    currentProduct: Product,
  ): ScoredProduct[] {
    if (scored.length >= RECOMMENDATION.RECOMMENDATION_FALLBACK_SIZE) {
      return scored;
    }

    const currentCategoryIds = new Set((currentProduct.categories ?? []).map(c => c.id));
    const sameCategory = allProducts.filter(
      (p) =>
        p.id !== currentProduct.id &&
        !scored.some((s) => s.id === p.id) &&
        p.categories?.some(c => currentCategoryIds.has(c.id))
    );

    const combined = [...scored, ...sameCategory.map(p => ({...(p as Product), _score: 0}))];
    return combined;
  }
  
  private finalizeRecommendations(scored: ScoredProduct[]): Product[] {
    const sortedByStock = [
      ...scored.filter((p) => p.inventoryQuantity > 0),
      ...scored.filter((p) => p.inventoryQuantity <= 0),
    ];

    const uniqueIds = new Set<string>();
    const finalRecommendations: Product[] = [];
    Logger.log(`Final recommendations before filtering: ${sortedByStock.length}`, StorefrontProductRecommendationsRepository.name);

    for (const p of sortedByStock) {
      if (!uniqueIds.has(p.id)) {
        const { _score, ...product } = p;
        finalRecommendations.push(product as Product);
        uniqueIds.add(p.id);
      }
      if (finalRecommendations.length >= RECOMMENDATION.RECOMMENDATION_FINAL_LIST_SIZE) {
        break;
      }
    }

    return finalRecommendations;
  }
}