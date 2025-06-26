import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from 'generated/tenant';

// We import the enum directly from the generated Prisma client
// to ensure it is always in sync with the schema.

export class UpdatePaymentStatusDto {
    @IsEnum(PaymentStatus)
    @IsNotEmpty()
    paymentStatus: PaymentStatus;
}