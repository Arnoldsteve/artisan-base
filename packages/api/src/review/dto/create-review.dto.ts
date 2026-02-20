import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Max, 
  Min, 
  Length 
} from 'class-validator';

/**
 * SOLID Principle: Single Responsibility
 * This DTO handles the input validation for creating a product review.
 */
export class CreateReviewDto {
  @ApiProperty({ 
    example: 'clv123abc...', 
    description: 'The unique ID of the product being reviewed' 
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ 
    example: 5, 
    description: 'Rating score from 1 to 5',
    minimum: 1,
    maximum: 5 
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ 
    example: 'This product exceeded my expectations! Highly recommend.', 
    description: 'Optional text feedback from the customer' 
  })
  @IsString()
  @IsOptional()
  @Length(1, 1000) // Enterprise limit to prevent database bloat
  comment?: string;
}