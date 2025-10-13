import { Module } from '@nestjs/common';
import { StorefrontProductModule } from './products/storefront-product.module';
import { StorefrontCategoryModule } from './categories/storefront-category.module';
import { StorefrontOrderModule } from './orders/storefront-order.module';
import { StorefrontAuthModule } from './auth/storefront-auth.module';
import { StorefrontChatModule } from './chat/storefront-chat.module';
import { StorefrontNewsletterModule } from './newsletter/storefront-newsletter.module';
import { StorefontProductRecommendationsModule } from './product-recommendations/storefront-product-recommendations.module';
import { StorefrontContactModule } from './contact/storefront-contact.module';
import { StorefontReviewModule } from './reviews/storefront-review.module';

@Module({
  imports: [
    StorefrontProductModule,
    StorefrontCategoryModule,
    StorefrontOrderModule,
    StorefrontAuthModule,
    StorefrontChatModule,
    StorefrontNewsletterModule,
    StorefontProductRecommendationsModule,
    StorefrontContactModule,
    StorefontReviewModule
  ],
})
export class StorefrontModule {}
