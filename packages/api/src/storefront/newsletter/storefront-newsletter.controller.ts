import {
  Controller,
  Post,
  Body,
  Scope,
  ValidationPipe,
} from '@nestjs/common';
import { NewsletterSubscriptionDto } from './dto/newsletter-subscription.dto';
import { StorefrontNewsletterService } from './storefront-newsletter.service';
@Controller({
  path: 'storefront/newsletter',
  scope: Scope.REQUEST,
})
export class StorefrontNewsletterController {
  constructor(
    private readonly newsletterService: StorefrontNewsletterService,
  ) {}

  @Post('subscribe')
  async subscribe(
    @Body(ValidationPipe) dto: NewsletterSubscriptionDto,
  ): Promise<any> {
    return this.newsletterService.subscribe(dto);
  }
}
