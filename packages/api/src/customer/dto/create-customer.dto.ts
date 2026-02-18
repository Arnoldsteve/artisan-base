import { IsEmail, IsNotEmpty, IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * SOLID Principle: Single Responsibility
 * Validates the incoming data for creating a customer within a tenant.
 */
export class CreateCustomerDto {
  @ApiProperty({ example: 'customer@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+254700000000', required: false })
  @IsOptional()
  @IsString()
  // Note: Using IsPhoneNumber is standard for African/Global reach
  @IsPhoneNumber() 
  phone?: string;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}