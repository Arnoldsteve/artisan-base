import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class ChangePlanDto {
  @ApiProperty({ description: 'New plan ID' })
  @IsString()
  @IsNotEmpty()
  newPlanId: string;

  @ApiPropertyOptional({
    description: 'New Stripe Price ID — required for Stripe tenants',
  })
  @IsOptional()
  @IsString()
  newStripePriceId?: string;

  @ApiPropertyOptional({
    description: 'New plan amount — required for Mpesa tenants',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  newAmount?: number;
}