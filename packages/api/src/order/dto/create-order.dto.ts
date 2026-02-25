import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  IsArray, 
  IsOptional, 
  ValidateNested, 
  IsEnum, 
  IsObject,
  ArrayMinSize
} from 'class-validator';
import { Type } from 'class-transformer';
import { Currency } from '@generated/prisma/client';

/**
 * SOLID Principle: Single Responsibility
 * We define internal classes for complex JSON structures 
 * to ensure strict validation of shipping/billing data.
 */
class AddressDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() addressLine1: string;
  @IsString() @IsOptional() addressLine2?: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() state: string;
  @IsString() @IsNotEmpty() postalCode: string;
  @IsString() @IsNotEmpty() country: string;
}

class OrderItemDto {
  @ApiProperty({ description: 'The ID of the product' })
  @IsString() @IsNotEmpty() productId: string;

  @ApiProperty({ description: 'Optional variant ID' })
  @IsString() @IsOptional() variantId?: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty() @Type(() => Number) quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: AddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @ApiProperty({ type: AddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress: AddressDto;

  @ApiPropertyOptional({ enum: Currency, default: Currency.KES })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiPropertyOptional({ example: 'Please leave at the front gate' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Existing customer ID if logged in' })
  @IsString()
  @IsOptional()
  customerId?: string;
}