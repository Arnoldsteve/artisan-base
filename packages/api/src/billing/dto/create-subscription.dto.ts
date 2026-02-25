import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
} from 'class-validator';
import { Currency } from '@generated/prisma/client';

export enum BillingCycleDto {
  MONTHLY = 'MONTHLY',
  YEARLY  = 'YEARLY',
}

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Plan ID to subscribe to' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ enum: BillingCycleDto })
  @IsEnum(BillingCycleDto)
  billingCycle: BillingCycleDto;

  @ApiPropertyOptional({
    description: 'Stripe Price ID — required for Stripe (USD/EUR/GBP) tenants',
    example: 'price_1ABC...',
  })
  @IsOptional()
  @IsString()
  stripePriceId?: string;

  @ApiPropertyOptional({
    description: 'Phone number — required for Mpesa (KES) tenants',
    example: '254712345678',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}