import { CreateStorefrontReviewDto } from '../dto/create-storefront-review.dto';
import { GetStorefrontReviewsDto } from '../dto/get-storefront-reviews.dto';

export interface IStorefrontReviewRepository {
  create(dto: CreateStorefrontReviewDto): Promise<any>;
  findAll(options: GetStorefrontReviewsDto): Promise<any[]>;
}
