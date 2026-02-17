import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentProviderRegistry } from './providers/payment-provider.registry';
import { MpesaProvider } from './providers/mpesa.provider';
import { StripeProvider } from './providers/stripe.provider';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    PaymentProviderRegistry,
    MpesaProvider,
    StripeProvider,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
