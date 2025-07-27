import { Injectable, Scope, Inject } from '@nestjs/common';
import { NewsletterSubscriptionDto } from './dto/newsletter-subscription.dto';
import { IStorefrontNewsletterRepository } from './interfaces/storefront-newsletter-repository.interface';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontNewsletterService {
  constructor(
    @Inject('StorefrontNewsletterRepository')
    private readonly newsletterRepository: IStorefrontNewsletterRepository,
  ) {}

  async subscribe(dto: NewsletterSubscriptionDto): Promise<any> {
    return this.newsletterRepository.subscribeToNewsletter(dto);
  }
}
