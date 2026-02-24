import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentProviderRegistry } from './providers/payment-provider.registry';
import { MpesaProvider } from './providers/mpesa.provider';
import { StripeProvider } from './providers/stripe.provider';
import { PaymentProcessor } from './processors/payment.processor'; 
import { PaypalProvider } from './providers/paypal.provider';

/**
 * Pure Infrastructure Module.
 * Owns: registry, providers, repository, controller, and background workers.
 * millions of users: Exports only the Service to maintain strict encapsulation.
 */
@Module({
  imports: [
    HttpModule,     // Required for external API calls (Daraja/Stripe)
    ConfigModule,   // Required for environment secrets
  ],
  controllers: [PaymentController],
  providers: [
    // --- 1. Core Logic & Data ---
    PaymentService,
    PaymentRepository,

    // --- 2. Registry & Strategies (Open/Closed Principle) ---
    PaymentProviderRegistry,
    MpesaProvider,
    StripeProvider,
    PaypalProvider,

    // --- 3. Background Workers (Scalability) ---
    PaymentProcessor, 
  ],
  exports: [PaymentService, PaymentRepository, PaymentProviderRegistry ], 
})
export class PaymentModule {}