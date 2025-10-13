import { Injectable, Scope, Inject } from '@nestjs/common';
import { CreateStorefrontOrderDto } from './dto/create-storefront-order.dto';
import { GetStorefrontOrdersDto } from './dto/get-storefront-orders.dto';
import { StorefrontOrderRepository } from './storefront-order.repository';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontOrderService {
  constructor(
    private readonly orderRepository: StorefrontOrderRepository,
  ) {}

  async create(dto: CreateStorefrontOrderDto) {
    return this.orderRepository.create(dto);
  }

  async getOrders(query: GetStorefrontOrdersDto) {
    return this.orderRepository.getOrders(query);
  }

  async getOrder(id: string, query: GetStorefrontOrdersDto) {
    return this.orderRepository.getOrder(id, query);
  }
}
