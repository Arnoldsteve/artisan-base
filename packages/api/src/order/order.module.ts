import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';
import { OrderListener } from './listeners/order.listener'; 
import { ProductModule } from '@/product/product.module';
import { UserModule } from '@/user/user.module';
import { PaymentStatusListener } from './listeners/payment-status.listener';
import { PaymentModule } from '@/payment/payment.module';
import { OrderProcessor } from './processors/order.processor';

@Module({
  imports: [
    ProductModule, 
    UserModule,
    PaymentModule
  ],
  controllers: [OrderController],
  providers: [
    OrderService, 
    OrderRepository, 
    OrderListener,
    PaymentStatusListener,
    OrderProcessor 
  ],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}