import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  Scope,
} from '@nestjs/common';
import { StorefrontReviewRepository } from './storefront-review.repository';
import { CreateStorefrontReviewDto } from './dto/create-storefront-review.dto';
import { StorefrontProductService } from '../products/storefront-product.service';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontReviewService {
  private readonly logger = new Logger(StorefrontReviewService.name);

  constructor(
    private readonly reviewRepository: StorefrontReviewRepository,
    private readonly productService: StorefrontProductService, 
  ) {}

  async create(dto: CreateStorefrontReviewDto) {
    const product = await this.productService.findOne(dto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.reviewRepository.checkExistingReview(
      dto.productId,
      dto.customerId,
    );

    if (existing) {
      throw new BadRequestException(
        'You have already submitted a review for this product.',
      );
    }

    const review = await this.reviewRepository.create(dto);

    this.logger.log(
      `Review created for product ${dto.productId} by customer ${dto.customerId}`,
    );

    return review;
  }
}
