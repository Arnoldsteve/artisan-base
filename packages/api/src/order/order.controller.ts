import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@ApiHeader({ name: 'x-tenant-id', required: true })
@Controller('orders')
@UseGuards(JwtAuthGuard, TenantMembershipGuard, TenantRolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // =======================
  // PUBLIC STORE FRONTEND
  // =======================

  @Public()
  @Get()
  @ApiOperation({ summary: 'List orders for a customer (Public Storefront)' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.orderService.findAll(page, limit);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID (Public Storefront)' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Public()
  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get all orders for a customer (Public Storefront)' })
  async findByCustomer(@Param('customerId') customerId: string) {
    return this.orderService.findByCustomer(customerId);
  }

  // =======================
  // PRIVATE DASHBOARD
  // =======================

  @ApiBearerAuth()
  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create a new order (Dashboard)' })
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update an order (Dashboard)' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order (Dashboard)' })
  async remove(@Param('id') id: string) {
    await this.orderService.remove(id);
  }

  @ApiBearerAuth()
  @Post(':id/items')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Add items to an existing order (Dashboard)' })
  async addItems(
    @Param('id') id: string,
    @Body() body: { items: CreateOrderDto['items'] },
  ) {
    return this.orderService.addItems(id, body.items);
  }
}
