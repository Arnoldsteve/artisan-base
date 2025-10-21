import { Type } from 'class-transformer';
import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsBoolean, 
  IsNotEmpty 
} from 'class-validator';

// ============================================================================

export class CreateCustomerAddressDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsOptional()
  @IsString()
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

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}



export class CreateCustomerDto {
  @IsEmail()
  @IsNotEmpty()
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

  @IsOptional()
  @IsString()
  hashedPassword?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // This is crucial: it tells class-validator to validate each object in the array
  @Type(() => CreateCustomerAddressDto) // This tells class-transformer which class to use for the nested objects
  addresses?: CreateCustomerAddressDto[];
}

/**
 * Data Transfer Object for updating an existing customer.
 * All properties are optional. This can be a separate class for clarity.
 */
export class UpdateCustomerDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  hashedPassword?: string;
}
