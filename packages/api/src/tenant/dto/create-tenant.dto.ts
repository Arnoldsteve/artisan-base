// In packages/api/src/tenant/dto/create-tenant.dto.ts
import { 
  IsNotEmpty, 
  IsString, 
  Matches, 
  Length, 
  IsOptional
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 63, {
    message: 'Subdomain must be between 3 and 63 characters long'
  })
  @Matches(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, {
    message: 'Subdomain must start and end with alphanumeric characters and can only contain lowercase letters, numbers, and hyphens'
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  subdomain: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100, {
    message: 'Store name must be between 1 and 100 characters long'
  })
  @Transform(({ value }) => value?.trim())
  storeName: string;

  // This will be set from the authenticated user context
  // Not included in the DTO validation since it comes from JWT/session
  ownerId?: string;
}

// Optional: Create a separate DTO for checking subdomain availability
export class CheckSubdomainDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 63)
  @Matches(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, {
    message: 'Invalid subdomain format'
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  subdomain: string;
}