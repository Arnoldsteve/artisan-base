import { Module, Scope } from '@nestjs/common';
import { StorefrontReviewController } from './storefront-review.controller';
import { StorefrontReviewService } from './storefront-review.service';
import { TenantContextService } from '@/common/tenant-context.service';
import { StorefrontReviewRepository } from './storefront-review.repository';
import { StorefrontProductModule } from '../products/storefront-product.module';
import { StorefrontAuthModule } from '../auth/storefront-auth.module';

@Module({
  imports: [
    StorefrontProductModule,
    StorefrontAuthModule,
  ],
  controllers: [StorefrontReviewController],
  providers: [
    StorefrontReviewService,
    StorefrontReviewRepository,
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
})
export class StorefontReviewModule {}
