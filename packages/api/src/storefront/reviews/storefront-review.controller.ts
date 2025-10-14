import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Scope,
  Logger,
  Query,
  Get,
  Param,
} from '@nestjs/common';
import { StorefrontReviewService } from './storefront-review.service';
import { CreateStorefrontReviewDto } from './dto/create-storefront-review.dto';
import { GetStorefrontReviewsDto } from './dto/get-storefront-reviews.dto';

@Controller({
  path: 'storefront/reviews',
  scope: Scope.REQUEST,
})
export class StorefrontReviewController {
  constructor(private readonly reviewService: StorefrontReviewService) {}

  @Post()
  async create(@Body(ValidationPipe) dto: CreateStorefrontReviewDto) {
    return this.reviewService.create(dto);
  }

  @Get()
  async findAll(@Query(ValidationPipe) filters: GetStorefrontReviewsDto) {
    return this.reviewService.findAll(filters);
  }

  @Get('product/:productId')
  async findByProduct(@Param('productId') productId: string) {
    const review =
      await this.reviewService.findRatingsWithReviewsByProductId(productId);
    return review;
  }
}
