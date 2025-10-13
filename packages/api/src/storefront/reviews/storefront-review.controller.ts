import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Scope,
  Logger,
} from '@nestjs/common';
import { StorefrontReviewService } from './storefront-review.service';
import { CreateStorefrontReviewDto } from './dto/create-storefront-review.dto';

@Controller({
  path: 'storefront/reviews',
  scope: Scope.REQUEST,
})
export class StorefrontReviewController {
  constructor(private readonly reviewService: StorefrontReviewService) {}

  @Post()
  async create(@Body(ValidationPipe) dto: CreateStorefrontReviewDto) {
    Logger.log(`Creating storefront review: ${JSON.stringify(dto)}`);
    return this.reviewService.create(dto);
  }
}
