import { 
  Controller, 
  Get, 
  Patch, 
  Body, 
  UseGuards, 
  Query, 
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';

// --- Guards & Decorators ---
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
// import { TenantId } from '@/common/decorators/tenant-id.decorator';
import { TenantId } from '@/auth/decorators/tenant-id.decorator';

// --- Business Logic ---
import { TenantService } from './tenant.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';

/**
 * SOLID Principle: Interface Segregation
 * This controller handles management of the Store (Tenant) entity.
 */
@ApiTags('Tenant Management')
@ApiBearerAuth() 
@ApiHeader({
  name: 'x-tenant-id',
  description: 'The unique ID of the store being accessed',
  required: true,
})
@Controller('tenant')
@UseGuards(JwtAuthGuard, TenantMembershipGuard, TenantRolesGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Get the current store profile.
   * Millions of Users: Uses the context-injected tenantId for safety.
   */
  @Get('profile')
  @ApiOperation({ summary: 'Get current store configuration and status' })
  @ApiResponse({ status: 200, description: 'Store profile retrieved successfully.' })
  async getProfile(@TenantId() tenantId: string) {
    return this.tenantService.getStoreProfile(tenantId);
  }

  /**
   * Update store settings.
   * Security: Restricted to Owners and Admins only.
   */
  @Patch('settings')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Update store settings (Name, Currency, Timezone)' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully.' })
  async updateSettings(
    @TenantId() tenantId: string,
    @Body() dto: UpdateTenantDto,
  ) {
    return this.tenantService.updateStore(tenantId, dto);
  }

  /**
   * List staff members of the store.
   * Performance: Implements pagination for high-volume data.
   */
  @Get('staff')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'List all staff members associated with this store' })
  async getStaff(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.tenantService.listStaffMembers(page, limit);
  }
}