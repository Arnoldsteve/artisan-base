import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  Min, 
  IsOptional, 
  IsArray, 
  IsBoolean,
  Matches
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Vintage Leather Bag' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({ example: 'vintage-leather-bag', description: 'URL-friendly identifier' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens' })
  slug: string;

  @ApiPropertyOptional({ example: 'Handcrafted in Nairobi with genuine leather' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 4500.00, description: 'Price in the store base currency' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'VLB-001', description: 'Unique Stock Keeping Unit' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase().trim())
  sku?: string;

  @ApiPropertyOptional({ example: 50, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  inventoryQuantity?: number = 0;

  @ApiPropertyOptional({ example: ['https://cdn.com/image1.jpg'], default: [] })
  @IsOptional()
  @IsArray()
  images?: string[] = [];

  @ApiPropertyOptional({ example: ['cat_id_123'], description: 'List of category IDs to associate' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}