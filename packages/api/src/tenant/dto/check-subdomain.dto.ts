import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  Matches, 
  Length 
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * SOLID Principle: Single Responsibility
 * This DTO specifically handles the validation for subdomain availability checks.
 */
export class CheckSubdomainDto {
  @ApiProperty({ 
    example: 'arnolds-coffee', 
    description: 'The subdomain to check for availability' 
  })
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
}