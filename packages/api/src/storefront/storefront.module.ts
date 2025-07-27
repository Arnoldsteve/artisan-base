import { Module } from '@nestjs/common';
import { StorefrontProductModule } from './products/storefront-product.module';
import { StorefrontCategoryModule } from './categories/storefront-category.module';
import { StorefrontOrderModule } from './orders/storefront-order.module';
import { StorefrontAuthModule } from './auth/storefront-auth.module';
import { StorefrontChatModule } from './chat/storefront-chat.module';
import { StorefrontNewsletterModule } from './newsletter/storefront-newsletter.module';

@Module({
  imports: [
    StorefrontProductModule,
    StorefrontCategoryModule,
    StorefrontOrderModule,
    StorefrontAuthModule,
    StorefrontChatModule,
    StorefrontNewsletterModule,
  ],
})
export class StorefrontModule {}
