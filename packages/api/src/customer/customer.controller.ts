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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';

// --- Guards & Decorators ---
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';

// --- Business Logic ---
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Pagination } from '@/common/pagination/decorators/get-pagination.decorator';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';

@ApiTags('Customer Management')
@ApiHeader({ name: 'x-tenant-id', required: true, description: 'The ID of the tenant/store' })
@ApiBearerAuth()
@Controller('customers')
@UseGuards(JwtAuthGuard, TenantMembershipGuard, TenantRolesGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * PRIVATE: List all customers for this tenant.
   * Restricted to Staff/Admins.
   */
  @Get()
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @ApiOperation({ summary: 'List all customers (Dashboard)' })
  async findAll(@Pagination() options: PageOptionsDto) {
    return this.customerService.findAll(options);
  }

  /**
   * PRIVATE: Get a specific customer's details.
   */
  @Get(':id')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @ApiOperation({ summary: 'Get customer details' })
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  /**
   * PRIVATE: Manually create a customer.
   * Useful for phone orders or manual entry in the African market.
   */
  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @ApiOperation({ summary: 'Create a new customer' })
  async create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  /**
   * PRIVATE: Update customer contact info.
   */
  @Patch(':id')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update customer information' })
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(id, dto);
  }

  /**
   * PRIVATE: Delete a customer record.
   * Restricted to high-level roles only.
   */
  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 200, description: 'Customer successfully deleted' })
  async remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}