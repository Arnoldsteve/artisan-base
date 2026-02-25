import { 
  Controller, 
  Get, 
  Patch, 
  Post,
  Body, 
  UseGuards, 
  Query, 
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
  Param
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';

// --- Guards & Decorators ---
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { TenantId } from '@/auth/decorators/tenant-id.decorator';
import { Public } from '@/auth/decorators/public.decorator';

// --- Business Logic ---
import { TenantService } from './tenant.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { Pagination } from '@/common/pagination/decorators/get-pagination.decorator';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';

@ApiTags('Tenant Management')
@Controller('tenant')
@UseGuards(JwtAuthGuard) // Default: Protected
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * PUBLIC ACTION: Resolve Storefront
   * Used by the Next.js Storefront to identify the store from the URL slug.
   * millions of users: Bypasses JWT and x-tenant-id requirements.
   */
  @Public()
  @Get('resolve/:slug')
  @ApiOperation({ summary: 'Resolve a store slug to a real profile (Storefront Entry)' })
  @ApiResponse({ status: 200, description: 'Store profile resolved.' })
  async resolve(@Param('slug') slug: string) {
    return this.tenantService.resolveStoreBySlug(slug);
  }

  /**
   * GLOBAL ACTION: Create a new store (Sidebar Switcher).
   */
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new store to your existing account' })
  async createStore(@Req() req: any, @Body() dto: CreateStoreDto) {
    const userId = req.user.id;
    return this.tenantService.provisionStore(userId, dto);
  }

  /**
   * STORE ACTION: Get current store profile.
   */
  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(TenantMembershipGuard)
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiOperation({ summary: 'Get current store configuration' })
  async getProfile(@TenantId() tenantId: string) {
    return this.tenantService.getStoreProfile(tenantId);
  }

  /**
   * STORE ACTION: Update settings.
   */
  @Patch('settings')
  @ApiBearerAuth()
  @Roles('OWNER', 'ADMIN')
  @UseGuards(TenantMembershipGuard, TenantRolesGuard)
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiOperation({ summary: 'Update store settings' })
  async updateSettings(
    @TenantId() tenantId: string,
    @Body() dto: UpdateTenantDto,
  ) {
    return this.tenantService.updateStore(tenantId, dto);
  }

  /**
   * STORE ACTION: List staff.
   */
  @Get('staff')
  @ApiBearerAuth()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @UseGuards(TenantMembershipGuard, TenantRolesGuard)
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiOperation({ summary: 'List all staff members' })
  async getStaff(@Pagination() options: PageOptionsDto) {
    return this.tenantService.listStaffMembers(options);
  }
}