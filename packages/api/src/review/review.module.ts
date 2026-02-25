import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './repositories/review.repository';
import { ProductModule } from '../product/product.module';
import { TenantModule } from '../tenant/tenant.module';

/**
 * SOLID Principle: Encapsulation
 * This module bundles all review-related logic and ensures
 * its dependencies (Products and Tenants) are satisfied.
 */
@Module({
  imports: [
    ProductModule, // Required so ReviewService can use ProductRepository
    TenantModule,  // Required for Tenant-aware Guards
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewService, ReviewRepository],
})
export class ReviewModule {}