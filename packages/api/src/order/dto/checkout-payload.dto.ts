import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsArray, 
  IsEmail, 
  IsEnum, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  ValidateNested, 
  ArrayMinSize 
} from 'class-validator';
import { Type } from 'class-transformer';
// FIX: Import PaymentProvider instead of PaymentMethod
import { Currency, PaymentProvider } from '@generated/prisma/client';

/**
 * Sub-DTO for Customer Identity
 */
class CustomerDto {
  @ApiProperty({ example: 'Steve' })
  @IsString() @IsNotEmpty() firstName: string;

  @ApiProperty({ example: 'Otieno' })
  @IsString() @IsNotEmpty() lastName: string;

  @ApiProperty({ example: 'steve@example.com' })
  @IsEmail() email: string;

  @ApiProperty({ example: '+254712345678' })
  @IsString() @IsNotEmpty() phone: string;
}

/**
 * Sub-DTO for Standardized Address
 */
class AddressDto {
  @IsString() @IsNotEmpty() addressLine1: string;
  @IsString() @IsOptional() addressLine2?: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() state: string;
  @IsString() @IsNotEmpty() postalCode: string;
  @IsString() @IsNotEmpty() country: string;
}

class OrderItemDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsString() @IsOptional() variantId?: string;
  @IsNotEmpty() @Type(() => Number) quantity: number;
}

class VendorGroupDto {
  @ApiProperty({ description: 'The unique ID of the artisan store' })
  @IsString() @IsNotEmpty() tenantId: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString() @IsNotEmpty() shippingMethodId: string;
}

export class CheckoutPayloadDto {
  @ApiProperty({ type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  // FIX: Use PaymentProvider to match your schema.prisma
  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  paymentProvider: PaymentProvider;

  @ApiProperty({ enum: Currency })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ type: [VendorGroupDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => VendorGroupDto)
  vendors: VendorGroupDto[];
}