import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus, PaymentStatus } from 'generated/tenant';

// We import the enums directly from the generated Prisma client
// to ensure they are always in sync with the schema.

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}

export class UpdatePaymentStatusDto {
    @IsEnum(PaymentStatus)
    @IsNotEmpty()
    paymentStatus: PaymentStatus;
}