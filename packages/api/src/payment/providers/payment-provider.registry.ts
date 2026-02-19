import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PaymentProvider } from '@generated/prisma/client';
import { IPaymentProvider } from '../interfaces/payment-provider.interface';

/**
 * Self-populating Registry.
 * Providers register themselves on module init.
 * Service just calls registry.get(provider) — no if/else chains.
 */
@Injectable()
export class PaymentProviderRegistry {
  private readonly logger = new Logger(PaymentProviderRegistry.name);
  private readonly providers = new Map<PaymentProvider, IPaymentProvider>();

  register(provider: IPaymentProvider): void {
    this.providers.set(provider.getName(), provider);
    this.logger.log(`✅ Registered payment provider: ${provider.getName()}`);
  }

  get(provider: PaymentProvider): IPaymentProvider {
    const strategy = this.providers.get(provider);
    if (!strategy) {
      throw new BadRequestException(
        `Payment provider [${provider}] is not supported or not registered`,
      );
    }
    return strategy;
  }

  getRegistered(): PaymentProvider[] {
    return Array.from(this.providers.keys());
  }
}