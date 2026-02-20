import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Public } from '@/auth/decorators/public.decorator';
import { GlobalRole } from '@generated/prisma/client';
import { GlobalRoles } from '@/auth/decorators/global-roles.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GlobalRolesGuard } from '@/auth/guards/global-roles.guard';


/**
 * Plan Controller.
 * GET  /plans         → public, any user
 * POST /plans         → SUPER_ADMIN only
 * PATCH /plans/:id    → SUPER_ADMIN only
 * DELETE /plans/:id   → SUPER_ADMIN only
 *
 * Note: SUPER_ADMIN guard to be added once auth guard is wired up.
 */
@ApiTags('Plans')
@Controller('plans')
@UseGuards(JwtAuthGuard, GlobalRolesGuard) // ← add this
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // ─── Public ──────────────────────────────────────────────────────────────────
  @Public()
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all active subscription plans' })
  async findAll() {
    return this.planService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  async findById(@Param('id') id: string) {
    return this.planService.findById(id);
  }

  // ─── Super Admin Only ─────────────────────────────────────────────────────────
  @GlobalRoles(GlobalRole.SUPER_ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[SUPER_ADMIN] Create a new subscription plan' })
  async create(@Body() dto: CreatePlanDto) {
    return this.planService.create(dto);
  }
  @GlobalRoles(GlobalRole.SUPER_ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[SUPER_ADMIN] Update a subscription plan' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  async update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.update(id, dto);
  }

  @GlobalRoles(GlobalRole.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[SUPER_ADMIN] Soft delete a subscription plan' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  async delete(@Param('id') id: string) {
    return this.planService.delete(id);
  }
}