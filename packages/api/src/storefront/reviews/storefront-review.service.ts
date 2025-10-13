import {
  Injectable,
  BadRequestException,
  Scope,
} from '@nestjs/common';
import { StorefrontReviewRepository } from './storefront-review.repository';
import { CreateStorefrontReviewDto } from './dto/create-storefront-review.dto';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontReviewService {
  constructor(private readonly reviewRepository: StorefrontReviewRepository
  ) {}

  async create(dto: CreateStorefrontReviewDto) {
    const existing = await this.reviewRepository.checkExistingReview(
      dto.productId,
      dto.customerId,
    );

    if (existing) {
      throw new BadRequestException(
        'You have already submitted a review for this product.',
      );
    }

    return this.reviewRepository.create(dto);
  }
}
