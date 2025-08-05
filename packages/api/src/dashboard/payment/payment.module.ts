import { Module, Scope } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TenantContextService } from 'src/common/tenant-context.service';
import { StripeService } from './stripe/stripe.service';
import { PayPalService } from './paypal/paypal.service'; 
import { ConfigModule } from '@nestjs/config';
import { MpesaService } from './mpesa/mpesa.service';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StripeService,
    PayPalService, 
    MpesaService, 
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
})
export class PaymentModule {}