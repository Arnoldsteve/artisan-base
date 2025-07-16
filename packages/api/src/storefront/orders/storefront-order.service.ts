import { Injectable, Scope, Inject } from '@nestjs/common';
import { CreateStorefrontOrderDto } from './dto/create-storefront-order.dto';
import { IStorefrontOrderRepository } from './interfaces/storefront-order-repository.interface';
import { GetStorefrontOrdersDto } from './dto/get-storefront-orders.dto';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontOrderService {
  constructor(
    @Inject('StorefrontOrderRepository')
    private readonly orderRepository: IStorefrontOrderRepository,
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
