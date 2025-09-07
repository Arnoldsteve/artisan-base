import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetStorefrontOrdersDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  customerId?: string;
}