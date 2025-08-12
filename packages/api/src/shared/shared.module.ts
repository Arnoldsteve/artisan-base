import { Module, Global } from '@nestjs/common';
import { StripeService } from './payment-providers/stripe/stripe.service';

@Global() 
@Module({
  providers: [
    StripeService,
  ],
  exports: [
    StripeService,
  ],
})
export class SharedModule {}