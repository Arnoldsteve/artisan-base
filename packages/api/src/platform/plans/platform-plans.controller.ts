import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,         // Import GET
  Param,       // Import Param
  Patch,       // Import PATCH
  Delete,
  UseInterceptors,      // Import DELETE
} from '@nestjs/common';
import { PlatformPlansService } from './platform-plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto'; // Import UpdatePlanDto
import { Roles, RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@prisma/client/management';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response.interceptor';

@Controller('platform/plans')
@UseGuards(JwtAuthGuard, RolesGuard) 
@UseInterceptors(TransformResponseInterceptor) 

export class PlatformPlansController {
  constructor(private readonly plansService: PlatformPlansService) {}

  @Post()
  @Roles([UserRole.PLATFORM_ADMIN])
  @HttpCode(HttpStatus.CREATED)
  createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.createPlan(createPlanDto);
  }

  @Get()
  @Roles([UserRole.PLATFORM_ADMIN])
  findAll() {
    return this.plansService.findAllPlans();
  }

  @Get(':id')
  @Roles([UserRole.PLATFORM_ADMIN])
  findOne(@Param('id') id: string) {
    return this.plansService.findPlanById(id);
  }

  @Patch(':id')
  @Roles([UserRole.PLATFORM_ADMIN])
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.updatePlan(id, updatePlanDto);
  }

  @Delete(':id')
  @Roles([UserRole.PLATFORM_ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on successful deletion
  remove(@Param('id') id: string) {
    return this.plansService.deletePlan(id);
  }
}