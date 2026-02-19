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
  Req
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';

// --- Guards & Decorators ---
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { TenantId } from '@/auth/decorators/tenant-id.decorator';

// --- Business Logic ---
import { TenantService } from './tenant.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { Pagination } from '@/common/pagination/decorators/get-pagination.decorator';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';

/**
 * SOLID Principle: Interface Segregation
 * This controller handles both Global actions (creating stores) 
 * and Store-specific actions (managing staff/settings).
 */
@ApiTags('Tenant Management')
@ApiBearerAuth() 
@UseGuards(JwtAuthGuard) // Every action here requires a valid JWT
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * SCENARIO 2: Create a new store (Sidebar Switcher).
   * This is a "Global" action for the user, so it DOES NOT 
   * require the x-tenant-id header.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new store to your existing account' })
  @ApiResponse({ status: 201, description: 'Store created and linked to user.' })
  async createStore(@Req() req: any, @Body() dto: CreateStoreDto) {
    // The user ID is extracted from the verified JWT payload
    const userId = req.user.id;
    return this.tenantService.provisionStore(userId, dto);
  }

  /**
   * STORE ACTION: Get current store profile.
   * Requires membership check and the store ID in the header.
   */
  @Get('profile')
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
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @UseGuards(TenantMembershipGuard, TenantRolesGuard)
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiOperation({ summary: 'List all staff members' })
  async getStaff(@Pagination() options: PageOptionsDto) {
    return this.tenantService.listStaffMembers(options);
  }
}