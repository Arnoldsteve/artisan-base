// import { Module, Scope, forwardRef } from '@nestjs/common'; // <-- IMPORT forwardRef
// import { PaymentController } from './payment.controller';
// import { PaymentService } from './payment.service';
// import { TenantContextService } from 'src/common/tenant-context.service';
// import { ConfigModule } from '@nestjs/config';
// import { StorefrontOrderModule } from 'src/storefront/orders/storefront-order.module';

// @Module({
//   imports: [
//     ConfigModule,
//     StorefrontOrderModule, 
//   ],
//   controllers: [PaymentController],
//   providers: [
//     PaymentService,
//     {
//       provide: TenantContextService,
//       useClass: TenantContextService,
//       scope: Scope.REQUEST,
//     },
//     // We do NOT need to provide StorefrontOrderRepository here
//     // because it's provided by the imported StorefrontOrderModule
//   ],
// })
// export class PaymentModule {}