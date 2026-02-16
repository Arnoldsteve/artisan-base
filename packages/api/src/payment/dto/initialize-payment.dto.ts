import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { PaymentProvider } from '../enums/payment-provider.enum';
import { PaymentMethod } from '../enums/payment-method.enum';

export class InitializePaymentDto {
  @ApiProperty({ description: 'Order ID to be paid for' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Optional redirect URL after successful payment',
  })
  @IsOptional()
  @IsUrl()
  returnUrl?: string;
}
