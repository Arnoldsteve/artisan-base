import { CreateStorefrontReviewDto } from '../dto/create-storefront-review.dto';

export interface IStorefrontReviewRepository {
  create(dto: CreateStorefrontReviewDto): Promise<any>;
}
