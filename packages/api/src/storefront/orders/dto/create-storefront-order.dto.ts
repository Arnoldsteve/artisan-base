import { Currency } from '../../../../generated/tenant';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPositive,
  IsString,
  ValidateNested,
  IsEnum,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  variantId?: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateStorefrontOrderDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer?: CustomerDto;

  @IsNotEmpty()
  shippingAddress: Record<string, any>;

  @IsNotEmpty()
  billingAddress: Record<string, any>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsEnum(Currency)
  currency: Currency;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  // @IsNumber()
  @IsPositive()
  shippingAmount?: number;
}