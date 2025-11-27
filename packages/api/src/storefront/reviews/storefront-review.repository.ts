import { Injectable, Scope, Logger } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontReviewRepository } from './interfaces/storefront-review-repository.interface';
import { CreateStorefrontReviewDto } from './dto/create-storefront-review.dto';
import { PrismaClient } from '../../../generated/tenant';
import { GetStorefrontReviewsDto } from './dto/get-storefront-reviews.dto';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontReviewRepository implements IStorefrontReviewRepository {
  private readonly logger = new Logger(StorefrontReviewRepository.name);
  private prismaClient: PrismaClient | null = null;

  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  /**
   * Create a new review
   */
  async create(dto: CreateStorefrontReviewDto) {
    const prisma = await this.getPrisma();

    return prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        productId: dto.productId,
        customerId: dto.customerId,
        isVerified: true,
        isApproved: true,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async findAll(options: GetStorefrontReviewsDto) {
    const prisma = await this.getPrisma();
    const {
      productId,
      customerId,
      rating,
      isApproved,
      isVerified,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    return prisma.review.findMany({
      where: {
        ...(productId && { productId }),
        ...(customerId && { customerId }),
        ...(rating !== undefined && { rating }),
        ...(isApproved !== undefined && { isApproved }),
        ...(isVerified !== undefined && { isVerified }),
      },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        product: { select: { id: true, name: true, slug: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async findRatingsWithReviewsByProductId(productId: string) {
    const prisma = await this.getPrisma();

    // Use a transaction to run all queries concurrently
    const [aggregate, reviews, product] = await prisma.$transaction([
      // Query 1: Aggregate rating info
      prisma.review.aggregate({
        where: { productId, isApproved: true },
        _avg: { rating: true },
        _count: { id: true },
      }),

      // Query 2: Fetch all reviews for the product
      prisma.review.findMany({
        where: { productId, isApproved: true },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Query 3: Fetch product info
      prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, slug: true },
      }),
    ]);

    // If the product doesn't exist, we might want to return null or throw an error
    if (!product) {
      // Depending on your use case, you could throw a NotFoundException here
      return null;
    }

    return {
      productId: product.id,
      slug: product.slug,
      averageRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count.id,
      reviews,
    };
  }

  async checkExistingReview(productId: string, customerId: string) {
    const prisma = await this.getPrisma();
    return prisma.review.findFirst({
      where: {
        productId,
        customerId,
      },
      select: { id: true },
    });
  }
}
