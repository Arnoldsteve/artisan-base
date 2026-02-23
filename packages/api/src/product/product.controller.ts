import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
} from '@nestjs/swagger';

// --- Guards & Decorators ---
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { Pagination } from '@/common/pagination/decorators/get-pagination.decorator';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';

// --- Business Logic ---
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Product Management')
/**
 * TOP 1% ARCHITECTURE: Optional Header
 * We set required: false at the class level.
 * Public routes will proceed in 'Global Mode' if the header is missing.
 * Private routes are still protected by Guards that will check for the header.
 */
@ApiHeader({
  name: 'x-tenant-id',
  required: false,
  description:
    'Optional for Marketplace discovery. Required for Storefront isolation.',
})
@Controller('products')
@UseGuards(JwtAuthGuard, TenantMembershipGuard, TenantRolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * PUBLIC: List products.
   * millions of users: Returns Global data if x-tenant-id is missing.
   * Returns Isolated data if x-tenant-id is present.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'List products (Marketplace or Storefront)' })
  async findAll(@Pagination() options: PageOptionsDto) {
    return this.productService.findAll(options);
  }

  /**
   * PUBLIC: Get a specific product by its URL Slug.
   * millions of users: Essential for SEO and Social Sharing.
   */
  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product details by SEO slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  /**
   * PUBLIC: Get a specific product by ID.
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product details by ID' })
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);

    return {
      success: true,
      data: product,
    };
  }

  /**
   * PRIVATE: Create a product (Dashboard).
   */
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create a new product' })
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  /**
   * PRIVATE: Update a product.
   */
  @ApiBearerAuth()
  @Patch(':id')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update product details' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  /**
   * PRIVATE: Delete a product.
   */
  @ApiBearerAuth()
  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Delete a product' })
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
