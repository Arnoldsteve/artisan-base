import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
  themeColor?: string;

  @IsOptional()
  @IsString()
  storeName?: string;

  // Add more fields as needed, with appropriate validation
} 