import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Scope,
  Inject,
} from '@nestjs/common';
// import { paginate } from 'src/common/helpers/paginate.helper';
// import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  CreateManualOrderDto,
  UpdateOrderDto,
  UpdatePaymentStatusDto,
} from './dto';
import { Decimal } from 'decimal.js';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { IOrderRepository } from './interfaces/order-repository.interface';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async createManualOrder(dto: CreateManualOrderDto) {
    const {
      items,
      customer,
      shippingAddress,
      billingAddress,
      notes,
      shippingAmount,
    } = dto;

    return this.orderRepository.createManualOrder(dto);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    Logger.log(
      `Fetching orders with pagination: ${JSON.stringify(paginationQuery)}`,
      OrderService.name,
    );
    return this.orderRepository.findAll(paginationQuery);
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found.`);
    }
    return order;
  }

  async updateStatus(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id); // Ensure order exists
    return this.orderRepository.updateStatus(id, updateOrderDto);
  }

  // A separate method for updating payment status
  async updatePaymentStatus(
    id: string,
    updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    await this.findOne(id); // Ensure order exists
    return this.orderRepository.updatePaymentStatus(id, updatePaymentStatusDto);
  }
}
