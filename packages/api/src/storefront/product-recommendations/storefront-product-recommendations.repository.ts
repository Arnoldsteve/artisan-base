import { Injectable, Logger, NotFoundException } from '@nestjs/common';

// This is the clean, correct way for modules to communicate: via a service.
import { StorefrontProductService } from '../products/storefront-product.service';

// These imports are all local to the 'product-recommendations' module.
import { Product } from './interfaces/product.interface';
import { IStorefrontProductRecommendationsRepository } from './interfaces/storefront-product-recommendations-repository.interface';
import { CategoryMatchStrategy } from './strategies/category-match.strategy';
import { TagSimilarityStrategy } from './strategies/tag-similarity.strategy';
import { PriceScoreStrategy } from './strategies/price-score.strategy';
import { PopularityScoreStrategy } from './strategies/popularity-score.strategy';
import * as RECOMMENDATION from './constants';

// A helper type to hold a Product along with its calculated score.
type ScoredProduct = Product & { _score: number };

@Injectable()
export class StorefrontProductRecommendationsRepository
  implements IStorefrontProductRecommendationsRepository
{
  constructor(
    // We inject the service from the 'products' module. NestJS provides it.
    private readonly productsService: StorefrontProductService,

    // We inject all our scoring strategies.
    private readonly categoryStrategy: CategoryMatchStrategy,
    private readonly tagStrategy: TagSimilarityStrategy,
    private readonly priceStrategy: PriceScoreStrategy,
    private readonly popularityStrategy: PopularityScoreStrategy,
  ) {}

  /**
   * Generates a list of recommended products.
   * This method contains all the business logic for scoring, sorting, and filtering.
   */
  async getRecommendations(productId: string): Promise<Product[]> {
    // 1. Fetch all necessary data using the injected service.
    const [allProductsResponse, currentProduct] = await Promise.all([
      this.productsService.findAll({ limit: 1000 }), // Get a large pool of products.
      this.productsService.findOne(productId),
    ]);

    if (!currentProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const allProducts = allProductsResponse.data;
    Logger.log(`Total products fetched: ${allProducts.length}`, StorefrontProductRecommendationsRepository.name);

    // 2. Score all other products based on the current one.
    let scored: ScoredProduct[] = allProducts
      .filter((p) => p.id !== productId)
      .map((p) => {
        const score = this.calculateTotalScore(currentProduct, p);
        return { ...(p as Product), _score: score };
      })
      .filter((p) => p._score > RECOMMENDATION.RECOMMENDATION_MINIMUM_SCORE)
      .sort((a, b) => b._score - a._score);

    // 3. Apply fallback logic if we don't have enough recommendations.
    scored = this.applyFallbackLogic(scored, allProducts, currentProduct);
    Logger.log(`Scored products after fallback logic: ${scored.length}`, StorefrontProductRecommendationsRepository.name);

    // 4. Finalize the list (sort by stock, ensure uniqueness, take top N).
    return this.finalizeRecommendations(scored);
  }

  /**
   * Calculates a weighted score for a product based on multiple strategies.
   */
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

  /**
   * Adds more products if the scored list is too small.
   */
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

  /**
   * Sorts the final list, prioritizes stock, removes duplicates, and returns the correct amount.
   */
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
        // Strip the internal _score property before returning to the client
        const { _score, ...product } = p;
        finalRecommendations.push(product);
        uniqueIds.add(p.id);
      }
      if (finalRecommendations.length >= RECOMMENDATION.RECOMMENDATION_FINAL_LIST_SIZE) {
        break;
      }
    }

    return finalRecommendations;
  }
}