import { NewsletterSubscriptionDto } from "../dto/newsletter-subscription.dto";

export interface IStorefrontNewsletterRepository {
  subscribeToNewsletter(data: NewsletterSubscriptionDto): Promise<any>; 
}