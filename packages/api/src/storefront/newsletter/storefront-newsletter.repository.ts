import { BadRequestException, Injectable, Scope } from "@nestjs/common";
import { TenantPrismaService } from "src/prisma/tenant-prisma.service";
import { IStorefrontNewsletterRepository } from "./interfaces/storefront-newsletter-repository.interface";
import { NewsletterSubscriptionDto } from "./dto/newsletter-subscription.dto";



@Injectable({ scope: Scope.REQUEST })
export class StorefrontNewsletterRepository implements IStorefrontNewsletterRepository {
  constructor(private readonly prisma: TenantPrismaService) {}

  async subscribeToNewsletter(data: NewsletterSubscriptionDto): Promise<any> {
    const existingSubscription = await this.prisma.newsletterSubscription.findUnique({
      where: { email: data.email },
    });

    if (existingSubscription) {
      throw new BadRequestException('Email is already subscribed to the newsletter.');
    }

    return this.prisma.newsletterSubscription.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        consentToMarketing: data.consentToMarketing ?? true,
      },
    });
  }
}
