import { Module, Global } from '@nestjs/common';
import { StripeService } from './payment-providers/stripe/stripe.service';
import { MpesaService } from './payment-providers/mpesa/mpesa.service';
import { PayPalService } from './payment-providers/paypal/paypal.service';

@Global() 
@Module({
  providers: [
    MpesaService,
    PayPalService,
    StripeService,
  ],
  exports: [
    MpesaService,
    PayPalService,
    StripeService,
  ],
})
export class SharedModule {}