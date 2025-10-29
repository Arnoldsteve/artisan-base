import { IsEmail, IsOptional, IsString, IsEnum, MinLength } from 'class-validator';
import { DashboardUserRole } from 'generated/tenant';

export class CreateDashboardUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEnum(DashboardUserRole)
  role: DashboardUserRole = DashboardUserRole.STAFF;

  // Temporary direct password creation field
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;
}
