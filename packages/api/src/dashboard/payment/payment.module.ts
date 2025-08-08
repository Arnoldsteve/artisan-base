import { Module, Scope, forwardRef } from '@nestjs/common'; // <-- IMPORT forwardRef
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TenantContextService } from 'src/common/tenant-context.service';
import { StripeService } from './stripe/stripe.service';
import { PayPalService } from './paypal/paypal.service'; 
import { ConfigModule } from '@nestjs/config';
import { MpesaService } from './mpesa/mpesa.service';
import { StorefrontOrderModule } from 'src/storefront/orders/storefront-order.module';

@Module({
  imports: [
    ConfigModule,
    StorefrontOrderModule, 
  ],
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
    // We do NOT need to provide StorefrontOrderRepository here
    // because it's provided by the imported StorefrontOrderModule
  ],
})
export class PaymentModule {}