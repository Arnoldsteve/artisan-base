import { IsOptional, IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class GetStorefrontReviewsDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isApproved?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isVerified?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}