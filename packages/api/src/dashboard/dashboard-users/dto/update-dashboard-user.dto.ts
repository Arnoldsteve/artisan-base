import { PartialType } from '@nestjs/mapped-types';
import { CreateDashboardUserDto } from './create-dashboard-user.dto';

export class UpdateDashboardUserDto extends PartialType(CreateDashboardUserDto) {}
