import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

// A DTO for a single line item in the order
class ManualOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsOptional() // A variant might not be chosen
  variantId?: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}

// A DTO for the customer's details
class CustomerDetailsDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

// A DTO for an address block (reusable for shipping/billing)
class AddressDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

// The main DTO for the entire request
export class CreateManualOrderDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDetailsDto)
  customer: CustomerDetailsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional() // Billing can be same as shipping, handled in service
  billingAddress?: AddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManualOrderItemDto)
  items: ManualOrderItemDto[];
  
  @IsNumber()
  @IsOptional() // Manually entered shipping cost
  shippingAmount?: number;
  
  @IsString()
  @IsOptional()
  notes?: string;
}