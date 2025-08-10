import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlatformPlansService } from './platform-plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Roles, RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@prisma/client/management';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; 

@Controller('platform/plans')
export class PlatformPlansController {
  constructor(private readonly plansService: PlatformPlansService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles([UserRole.PLATFORM_ADMIN])
  @HttpCode(HttpStatus.CREATED)
  createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.createPlan(createPlanDto);
  }
}