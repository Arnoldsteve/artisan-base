import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentProvider } from '@generated/prisma/client';
import { PaymentProviderInterface } from '../interfaces/payment-provider.interface';

@Injectable()
export class PaymentProviderRegistry {
  private readonly providers = new Map<PaymentProvider, PaymentProviderInterface>();

  // Providers automatically register themselves here
  register(provider: PaymentProviderInterface) {
    this.providers.set(provider.getName(), provider);
  }

  get(provider: PaymentProvider): PaymentProviderInterface {
    const strategy = this.providers.get(provider);
    if (!strategy) {
      throw new BadRequestException(`Payment provider ${provider} not supported or not registered`);
    }
    return strategy;
  }
}