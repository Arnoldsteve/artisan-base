import { Injectable, BadRequestException, Logger } from '@nestjs/common';
// import { Currency } from '@generated/prisma/client';
// import { Currency } from 'packages/api/generated/prisma/client';
import { Currency } from '@generated/prisma/client';
import { ISubscriptionProvider, BillingMode } from '../interfaces/subscription-provider.interface';

/**
 * Resolves the correct subscription provider at runtime.
 * Stripe → AUTOMATED (USD/EUR/GBP)
 * Mpesa  → MANUAL    (KES)
 */
@Injectable()
export class SubscriptionProviderRegistry {
  private readonly logger = new Logger(SubscriptionProviderRegistry.name);
  private readonly providers = new Map<BillingMode, ISubscriptionProvider>();

  // Currency → BillingMode mapping
  private readonly currencyModeMap: Partial<Record<Currency, BillingMode>> = {
    [Currency.KES]: 'MANUAL',
    [Currency.UGX]: 'MANUAL',
    [Currency.TZS]: 'MANUAL',
    [Currency.USD]: 'AUTOMATED',
    [Currency.EUR]: 'AUTOMATED',
    [Currency.GBP]: 'AUTOMATED',
    [Currency.JPY]: 'AUTOMATED',
    [Currency.NGN]: 'MANUAL',
    [Currency.GHS]: 'MANUAL',
    [Currency.ZAR]: 'MANUAL',
    [Currency.INR]: 'AUTOMATED',
    [Currency.CAD]: 'AUTOMATED',
  };

  register(provider: ISubscriptionProvider): void {
    this.providers.set(provider.getBillingMode(), provider);
    this.logger.log(`✅ Registered subscription provider: ${provider.getBillingMode()}`);
  }

  /**
   * Resolve by currency — intelligent routing.
   * KES tenant → MpesaSubscriptionProvider
   * USD tenant → StripeSubscriptionProvider
   */
  getForCurrency(currency: Currency): ISubscriptionProvider {
    const mode = this.currencyModeMap[currency] ?? 'AUTOMATED';
    return this.getForMode(mode);
  }

  getForMode(mode: BillingMode): ISubscriptionProvider {
    const provider = this.providers.get(mode);
    if (!provider) {
      throw new BadRequestException(
        `No subscription provider registered for billing mode: ${mode}`,
      );
    }
    return provider;
  }

  getRegisteredModes(): BillingMode[] {
    return Array.from(this.providers.keys());
  }
}