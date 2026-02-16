import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsOptional, 
  IsEnum, 
  Matches 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@generated/prisma/client';

/**
 * SOLID Principle: Single Responsibility
 * This class is responsible ONLY for the validation and type-safety 
 * of the onboarding data.
 */
export class RegisterTenantDto {
  // --- User Information ---
  @ApiProperty({ example: 'admin@artisan.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'Arnold' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Saka' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  // --- Tenant (Store) Information ---
  @ApiProperty({ example: 'Artisan Furniture' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'artisan-furniture' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Subdomain can only contain lowercase letters, numbers, and hyphens',
  })
  subdomain: string;

  // --- Localization (Kenya/Africa/Global) ---
  @ApiProperty({ enum: Currency, example: 'KES' })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiProperty({ example: 'Africa/Nairobi' })
  @IsOptional()
  @IsString()
  timezone?: string;
}