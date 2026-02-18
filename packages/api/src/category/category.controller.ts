import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Category Management')
@ApiHeader({ name: 'x-tenant-id', required: true })
@Controller('categories')
@UseGuards(JwtAuthGuard, TenantMembershipGuard, TenantRolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ---------------- PUBLIC ----------------
  @Public()
  @Get()
  @ApiOperation({ summary: 'List categories (Public Storefront)' })
  async findAll() {
    return this.categoryService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single category by ID (Public Storefront)' })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  // ---------------- PRIVATE ----------------
  @ApiBearerAuth()
  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create a new category (Dashboard)' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update a category by ID (Dashboard)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    Logger.debug("update dto", dto)
    return this.categoryService.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Delete a category by ID (Dashboard)' })
  async remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
