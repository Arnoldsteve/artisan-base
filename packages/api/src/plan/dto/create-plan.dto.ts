import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  Min,
  Length,
} from 'class-validator';
import { BillingCycle } from '@generated/prisma/client';

export class CreatePlanDto {
  @ApiProperty({ example: 'Pro' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @ApiPropertyOptional({ example: 'Best for growing businesses' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enum: BillingCycle })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiPropertyOptional({
    example: { products: 500, orders: 1000, staff: 10 },
    description: 'Feature limits for this plan',
  })
  @IsOptional()
  @IsObject()
  features?: Record<string, any>;

  @ApiPropertyOptional({
    example: 'price_1ABC123',
    description: 'Stripe Price ID — required for automated billing',
  })
  @IsOptional()
  @IsString()
  stripePriceId?: string;
}