import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentProviderRegistry } from './providers/payment-provider.registry';
import { MpesaProvider } from './providers/mpesa.provider';
import { StripeProvider } from './providers/stripe.provider';

/**
 * Pure Infrastructure Module.
 * Owns: registry, providers, repository, controller.
 * Exports: PaymentService only — callers (OrderModule, BillingModule) import this.
 */
@Module({
  imports: [
    HttpModule,     // MpesaProvider needs HttpService for Daraja API
    ConfigModule,   // Providers need ConfigService for keys
  ],
  controllers: [PaymentController],
  providers: [
    // Core
    PaymentService,
    PaymentRepository,

    // Registry — must be first so providers can register into it
    PaymentProviderRegistry,

    // Providers — self-register via onModuleInit
    MpesaProvider,
    StripeProvider,
  ],
  exports: [PaymentService], // BillingModule + OrderModule import this
})
export class PaymentModule {}