import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  controllers: [PaymentController],
  providers: [ PaymentRepository ],
  exports: [PaymentService],
})
export class PaymentModule {}
