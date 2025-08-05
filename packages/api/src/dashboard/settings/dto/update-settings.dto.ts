// File: packages/api/src/dashboard/settings/dto/index.ts
import { IsString, IsOptional, IsUrl, Matches, MaxLength } from 'class-validator';

// ============================================================================
// DTO for Core Store/Tenant Details
// ============================================================================

/**
 * DTO for updating the core details of a Tenant.
 * This corresponds to the top-level fields on your `Tenant` model.
 */
export class UpdateStoreDetailsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string; // Corresponds to the `name` field in the Tenant model
  
  // You might add other top-level fields here later, e.g., for custom domains
  @IsOptional()
  @IsString()
  @MaxLength(255)
  customDomain?: string;
}


// ============================================================================
// DTO for the JSONB 'settings' field
// ============================================================================

/**
 * DTO for updating the flexible settings stored in the `settings` JSONB field
 * of the Tenant model. This provides a structured and validated way to
 * modify the JSON data.
 */
export class UpdateStoreSettingsDto {
  @IsOptional()
  @IsUrl({}, { message: 'Please enter a valid URL for the store logo.' })
  logoUrl?: string;

  @IsOptional()
  @IsString()
  // This regex validates 3 or 6-digit hex color codes (e.g., #FFF or #FFFFFF)
  @Matches(/^#([0-9a-fA-F]{3}){1,2}$/, { message: 'Theme color must be a valid hex code.' })
  themeColor?: string;

  // You can add any other flexible settings you want to manage here.
  // For example, social media links:
  @IsOptional()
  @IsUrl({}, { message: 'Please enter a valid URL for your Twitter profile.'})
  twitterUrl?: string;
  
  @IsOptional()
  @IsUrl({}, { message: 'Please enter a valid URL for your Facebook page.'})
  facebookUrl?: string;
}