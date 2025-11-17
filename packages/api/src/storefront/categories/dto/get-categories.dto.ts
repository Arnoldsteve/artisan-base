import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetCategoriesDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  cursor?: string; 

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 36; 
}
