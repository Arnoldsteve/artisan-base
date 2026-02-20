import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Review } from '@generated/prisma/client';

/**
 * SOLID Principle: Single Responsibility
 * This repository handles direct database access for the Review model.
 * It uses the isolated Prisma client to enforce row-level multi-tenancy.
 */
@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new review for a product.
   * The 'tenantId' is automatically injected by our Prisma Extension.
   */
  async create(data: Prisma.ReviewUncheckedCreateInput): Promise<Review> {
    return this.prisma.client.review.create({
      data,
    });
  }

  /**
   * Lists all reviews for the current tenant.
   * Uses .client for automatic Row isolation.
   */
  async findAll(): Promise<Review[]> {
    return this.prisma.client.review.findMany({
      include: {
        product: {
          select: {
            name: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Finds all reviews for a specific product within the current store.
   * Millions of Users: We sort by latest to support fast indexed reads.
   */
  async findByProductId(productId: string): Promise<Review[]> {
    return this.prisma.client.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Finds a specific review by ID.
   */
  async findById(id: string): Promise<Review | null> {
    return this.prisma.client.review.findUnique({
      where: { id },
    });
  }

  /**
   * Deletes a review.
   */
  async delete(id: string): Promise<Review> {
    return this.prisma.client.review.delete({
      where: { id },
    });
  }

  /**
   * Enterprise Scalability: Aggregate review data for a product.
   * This is used to calculate the star rating summary.
   */
  async getProductRatingStats(productId: string) {
    return this.prisma.client.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { id: true },
    });
  }
}
