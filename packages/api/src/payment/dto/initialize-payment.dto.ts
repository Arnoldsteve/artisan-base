import { PaymentProvider } from '@generated/prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class InitializePaymentDto {
  @ApiProperty({ description: 'Order ID to be paid for' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({
    description: 'Optional redirect URL after successful payment',
  })
  @IsOptional()
  @IsUrl()
  returnUrl?: string;
}
