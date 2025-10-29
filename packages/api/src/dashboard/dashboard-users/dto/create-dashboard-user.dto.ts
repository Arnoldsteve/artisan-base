import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { TenantRole } from 'generated/tenant';

export class CreateDashboardUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEnum(TenantRole)
  role: TenantRole = TenantRole.STAFF;
}
