import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

// --- Guards & Decorators ---
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';

// --- Business Logic ---
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Product Management')
@ApiHeader({ name: 'x-tenant-id', required: true })
@Controller('products')
@UseGuards(JwtAuthGuard, TenantMembershipGuard, TenantRolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * PUBLIC: List products for the storefront.
   * @Public() allows guests to browse while the Middleware still filters by Tenant.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'List products (Public Storefront)' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.productService.findAll(page, limit);
  }

  /**
   * PUBLIC: Get a specific product by ID.
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product details' })
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  /**
   * PRIVATE: Create a product.
   * Restricted to Staff/Admins.
   */
  @ApiBearerAuth()
  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create a new product (Dashboard)' })
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