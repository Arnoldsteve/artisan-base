// 1. Import 'Matches' instead of 'IsCuid'
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ChangePlanDto {
  @IsString()
  @IsNotEmpty()
  // 2. Replace @IsCuid() with the @Matches() decorator
  // This regex checks that the string starts with 'c' followed by letters and numbers,
  // which is the standard format for a CUID.
  @Matches(/^c[a-z0-9]+$/, {
    message: 'planId must be a valid CUID',
  })
  planId: string;
}