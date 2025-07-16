import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Scope,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { StorefrontOrderService } from './storefront-order.service';
import { CreateStorefrontOrderDto } from './dto/create-storefront-order.dto';
import { GetStorefrontOrdersDto } from './dto/get-storefront-orders.dto';

@Controller({
  path: 'storefront/orders',
  scope: Scope.REQUEST,
})
export class StorefrontOrderController {
  constructor(private readonly orderService: StorefrontOrderService) {}

  @Post()
  async create(@Body(ValidationPipe) dto: CreateStorefrontOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  async getOrders(@Query() query: GetStorefrontOrdersDto) {
    return this.orderService.getOrders(query);
  }

  @Get(':id')
  async getOrder(
    @Param('id') id: string,
    @Query() query: GetStorefrontOrdersDto,
  ) {
    return this.orderService.getOrder(id, query);
  }
}
