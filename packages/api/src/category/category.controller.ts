import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
} from '@nestjs/swagger';

// --- Guards & Decorators ---
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';

// --- Business Logic ---
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('Category Management')
@ApiHeader({ name: 'x-tenant-id', required: true })
@Controller('categories')
@UseGuards(JwtAuthGuard, TenantMembershipGuard, TenantRolesGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * PUBLIC: List categories (Storefront filter UI)
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'List categories (Public Storefront)' })
  async findAll() {
    return this.categoryService.findAll();
  }

  /**
   * PRIVATE: Create category (Dashboard only)
   */
  @ApiBearerAuth()
  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create a new category (Dashboard)' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }
}
