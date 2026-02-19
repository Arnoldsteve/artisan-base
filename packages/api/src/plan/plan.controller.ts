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

/**
 * Plan Controller.
 * GET  /plans         → public, any authenticated user
 * POST /plans         → SUPER_ADMIN only
 * PATCH /plans/:id    → SUPER_ADMIN only
 * DELETE /plans/:id   → SUPER_ADMIN only
 *
 * Note: SUPER_ADMIN guard to be added once auth guard is wired up.
 */
@ApiTags('Plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // ─── Public ──────────────────────────────────────────────────────────────────

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all active subscription plans' })
  async findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  async findById(@Param('id') id: string) {
    return this.planService.findById(id);
  }

  // ─── Super Admin Only ─────────────────────────────────────────────────────────

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[SUPER_ADMIN] Create a new subscription plan' })
  async create(@Body() dto: CreatePlanDto) {
    return this.planService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[SUPER_ADMIN] Update a subscription plan' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  async update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[SUPER_ADMIN] Soft delete a subscription plan' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  async delete(@Param('id') id: string) {
    return this.planService.delete(id);
  }
}