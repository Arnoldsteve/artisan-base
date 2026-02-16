import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  Matches, 
  Length 
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * SOLID Principle: Single Responsibility
 * Defines the input contract for creating a product category.
 */
export class CreateCategoryDto {
  @ApiProperty({ example: 'Living Room' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({ 
    example: 'living-room', 
    description: 'URL-friendly identifier' 
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  slug: string;

  @ApiPropertyOptional({ example: 'Furniture and decor for the main living area' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  @Transform(({ value }) => value?.trim())
  description?: string;
}