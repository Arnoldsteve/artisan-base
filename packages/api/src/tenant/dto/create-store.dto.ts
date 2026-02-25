import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  Matches, 
  Length, 
  IsOptional, 
  IsEnum 
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Currency } from '@generated/prisma/client';

/**
 * SOLID Principle: Single Responsibility
 * This DTO handles only the store metadata for an existing user.
 * It does not include email/password because the user is already authenticated.
 */
export class CreateStoreDto {
  @ApiProperty({ example: 'Modern Furniture' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({ 
    example: 'modern-furniture', 
    description: 'Unique identifier for the store URL' 
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 63)
  @Matches(/^[a-z0-9-]+$/, { message: 'Subdomain must be lowercase alphanumeric with hyphens' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  subdomain: string;

  @ApiPropertyOptional({ enum: Currency, default: Currency.KES })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiPropertyOptional({ example: 'Africa/Nairobi' })
  @IsOptional()
  @IsString()
  timezone?: string;
}