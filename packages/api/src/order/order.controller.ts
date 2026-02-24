import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';

// --- Guards & Decorators ---
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';
import { Pagination } from '@/common/pagination/decorators/get-pagination.decorator';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';

// --- Business Logic ---
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CheckoutPayloadDto } from './dto/checkout-payload.dto';

@ApiTags('Orders')
/**
 * TOP 1% ARCHITECTURE: Optional Header
 * Required for Dashboard management (Isolation).
 * Optional for Marketplace Checkout (Global).
 */
@ApiHeader({ 
  name: 'x-tenant-id', 
  required: false, 
  description: 'Required for Dashboard. Omit for Global Multi-vendor Checkout.' 
})
@Controller('orders')
@UseGuards(JwtAuthGuard, TenantMembershipGuard, TenantRolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // ===========================================================================
  // 1. PUBLIC STOREFRONT (Discovery & Checkout)
  // ===========================================================================

  /**
   * GLOBAL ACTION: Multi-Vendor Checkout
   * millions of users: This handles the Jumia-style payload where items
   * are grouped by vendor. It creates separate orders in one transaction.
   */
  @Public()
  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Place a marketplace order (Supports multiple vendors)' })
  async checkout(@Body() dto: CheckoutPayloadDto) {
    Logger.log('Received checkout payload:', JSON.stringify(dto, null, 2));
    // return
    return this.orderService.createMarketplaceOrder(dto);
  }

  @Public()
  @Get('track/:id')
  @ApiOperation({ summary: 'Guest tracking: Get order details by ID' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // ===========================================================================
  // 2. PRIVATE DASHBOARD (Merchant Management)
  // ===========================================================================

  /**
   * STORE ACTION: List orders for the current tenant.
   * millions of users: Filtered automatically by x-tenant-id.
   */
  @ApiBearerAuth()
  @Get()
  @UseGuards(TenantMembershipGuard)
  @ApiOperation({ summary: 'List all orders for your store (Dashboard)' })
  async findAll(@Pagination() options: PageOptionsDto) {
    return this.orderService.findAll(options);
  }

  /**
   * STORE ACTION: Manual Order Creation
   * Used by merchants to create orders for walk-in customers (POS).
   */
  @ApiBearerAuth()
  @Post('manual')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @UseGuards(TenantMembershipGuard, TenantRolesGuard)
  @ApiOperation({ summary: 'Manually create an order for your store' })
  async createManualOrder(@Body() dto: any) {
    return this.orderService.create(dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @UseGuards(TenantMembershipGuard, TenantRolesGuard)
  @ApiOperation({ summary: 'Update order status or details' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @UseGuards(TenantMembershipGuard, TenantRolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently remove an order' })
  async remove(@Param('id') id: string) {
    await this.orderService.remove(id);
  }
}