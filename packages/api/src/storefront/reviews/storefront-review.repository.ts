import { Injectable, Scope, Logger } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontReviewRepository } from './interfaces/storefront-review-repository.interface';
import { CreateStorefrontReviewDto } from './dto/create-storefront-review.dto';
import { PrismaClient } from '../../../generated/tenant';

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
        isVerified: false,
        isApproved: false,
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

  /**
   * Check if this customer already reviewed this product
   */
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
