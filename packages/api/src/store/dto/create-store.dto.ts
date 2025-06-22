import { IsNotEmpty, IsString, IsAlphanumeric, MinLength, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric() // Ensures no special characters or spaces, good for subdomains
  @MinLength(3)
  @MaxLength(30)
  id!: string; // This will be the store's unique ID and subdomain

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name!: string; // This is the display name of the store
}