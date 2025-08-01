// File: packages/api/src/auth/dto/user-profile.dto.ts
import { IsEmail, IsString, IsOptional, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO representing a Tenant for the profile response.
 * We select only the necessary, non-sensitive fields.
 */
export class OrganizationDto {
  @IsString()
  id: string;

  @IsString()
  name: string; // The store name

  @IsString()
  subdomain: string;
}

/**
 * DTO representing the User for the profile response.
 * This reflects the Prisma model, allowing for nullable fields.
 */
export class UserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  // --- THIS IS THE FIX ---
  // Allow firstName to be null, matching the Prisma schema `String?`
  @IsOptional()
  @IsString()
  firstName: string | null;

  // --- THIS IS THE FIX ---
  // Allow lastName to be null
  @IsOptional()
  @IsString()
  lastName: string | null;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

/**
 * The main DTO for the entire GET /auth/profile response.
 */
export class UserProfileResponseDto {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrganizationDto) // Use the cleaner OrganizationDto
  organizations: OrganizationDto[];
}