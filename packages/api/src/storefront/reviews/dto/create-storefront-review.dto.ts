import { IsInt, IsString, IsOptional, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateStorefrontReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;
}