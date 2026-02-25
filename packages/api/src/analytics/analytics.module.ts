import { Module } from '@nestjs/common';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { AnalyticsListener } from './listeners/analytics.listener';
import { AnalyticsProcessor } from './processors/analytics.processor';
import { PaymentModule } from '../payment/payment.module';
import { OrderModule } from '../order/order.module'; 
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service'; 

@Module({
  imports: [
    PaymentModule, 
    OrderModule, 
  ],
  controllers: [AnalyticsController], 
  providers: [
    AnalyticsService,   
    AnalyticsRepository,
    AnalyticsListener,
    AnalyticsProcessor,
  ],
  exports: [
    AnalyticsRepository,
  ],
})
export class AnalyticsModule {}