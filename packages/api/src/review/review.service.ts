import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './repositories/review.repository';
import { ProductRepository } from '../product/repositories/product.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from '@generated/prisma/client';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';

/**
 * SOLID Principle: Single Responsibility
 * This service handles the business logic for reviews, 
 * strictly separating identity (customerId) from content (dto).
 */
@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly productRepo: ProductRepository,
    private readonly tenantContext: TenantContextService,
  ) {}

  /**
   * Creates a new review.
   * Logic: Ensures the product exists within the current tenant before saving.
   */
  async create(customerId: string, dto: CreateReviewDto): Promise<Review> {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    
     // 1. Business Logic: Ensure the product exists within the current tenant context
    // Our productRepo.findById already uses the isolated client
    const product = await this.productRepo.findById(dto.productId);
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found in this store.`);
    }

    // 2. Delegate to Repository (tenantId is injected automatically)
    return this.reviewRepo.create({
      tenantId,
      rating: dto.rating,
      comment: dto.comment,
      productId: dto.productId,
      customerId: customerId, 
    });
  }

  /**
   * Fetches all reviews for a specific product.
   */
  async getProductReviews(productId: string): Promise<Review[]> {
    return this.reviewRepo.findByProductId(productId);
  }

  /**
   * Fetches all reviews for the current tenant.
   * The Prisma Extension ensures isolation automatically.
   */
  async findAll(): Promise<Review[]> {
    // We'll need to add findMany to the repository or call it via client here
    return this.reviewRepo.findAll();
  }

  /**
   * Deletes a review.
   */
  async removeReview(id: string): Promise<Review> {
    const review = await this.reviewRepo.findById(id);

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found.`);
    }

    return this.reviewRepo.delete(id);
  }

  /**
   * Enterprise Logic: Get aggregated rating for a product page summary.
   */
  async getRatingSummary(productId: string) {
    const stats = await this.reviewRepo.getProductRatingStats(productId);

    return {
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.id || 0,
    };
  }
}
