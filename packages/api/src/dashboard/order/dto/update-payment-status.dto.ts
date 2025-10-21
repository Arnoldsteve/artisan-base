import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from 'generated/tenant';

export class UpdatePaymentStatusDto {
    @IsEnum(PaymentStatus)
    @IsNotEmpty()
    paymentStatus: PaymentStatus;
}