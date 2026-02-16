import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({ description: 'Internal payment ID' })
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @ApiProperty({ description: 'Transaction ID from provider' })
  @IsString()
  @IsNotEmpty()
  providerTransactionId: string;
}
