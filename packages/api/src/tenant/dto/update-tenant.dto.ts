import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsObject, 
  Length, 
  IsNotEmpty 
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Currency } from '@generated/prisma/client';

/**
 * SOLID Principle: Single Responsibility
 * This DTO defines the contract for updating a Store's configuration.
 */
export class UpdateTenantDto {
  @ApiPropertyOptional({ 
    example: 'Arnolds Coffee Roasters', 
    description: 'Updated name of the store' 
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiPropertyOptional({ 
    example: 'Africa/Nairobi', 
    description: 'The timezone for store operations and reporting' 
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  timezone?: string;

  @ApiPropertyOptional({ 
    enum: Currency, 
    description: 'The base baseCurrency for pricing and checkout' 
  })
  @IsOptional()
  @IsEnum(Currency)
  baseCurrency?: Currency;

  @ApiPropertyOptional({ 
    example: { theme: 'dark', lowStockThreshold: 5 }, 
    description: 'Generic JSON settings for the store' 
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}