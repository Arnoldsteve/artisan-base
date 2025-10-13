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
import { StorefrontAuthRepository } from '../auth/storefront-auth.repository';
import { GetStorefrontReviewsDto } from './dto/get-storefront-reviews.dto';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontReviewService {
  private readonly logger = new Logger(StorefrontReviewService.name);

  constructor(
    private readonly reviewRepository: StorefrontReviewRepository,
    private readonly productService: StorefrontProductService,
    private readonly authRepository: StorefrontAuthRepository,
  ) {}

  async create(dto: CreateStorefrontReviewDto) {
    const product = await this.productService.findOne(dto.productId);
    if (!product) throw new NotFoundException('Product not found');

    const customer = await this.authRepository.findCustomerById(dto.customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    const existing = await this.reviewRepository.checkExistingReview(
      dto.productId,
      customer.id,
    );
    if (existing) {
      throw new BadRequestException(
        'You have already submitted a review for this product.',
      );
    }

    const review = await this.reviewRepository.create({
      ...dto,
      customerId: customer.id,
    });

    this.logger.log(
      `Review created for product ${dto.productId} by customer ${customer.id}`,
    );

    return review;
  }

  async findAll(filters: GetStorefrontReviewsDto) {
    const reviews = await this.reviewRepository.findAll(filters);

    return {
      data: reviews,
      meta: {
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
        total: reviews.length, // optional: can fetch real total count separately if needed
      },
    };
  }

 async findRatingByProductId(id: string) {
  if (!id) throw new BadRequestException('Review ID is required');

  const review = await this.reviewRepository.findRatingsWithReviewsByProductId(id);
  console.log("review", review)

  if (!review) throw new NotFoundException('Review not found');

  return review;
}

}
