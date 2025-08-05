import {
  Injectable,
  Logger,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import {
  CreateManualOrderDto,
  UpdateOrderDto,
  UpdatePaymentStatusDto,
} from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { OrderRepository } from './order.repository'; // <-- IMPORT THE CLASS

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    // INJECT THE CLASS DIRECTLY. NO MORE @Inject() decorator or string token.
    private readonly orderRepository: OrderRepository,
  ) {}

  async createManualOrder(dto: CreateManualOrderDto) {
    // The service's job is simply to pass the DTO along.
    // The repository handles all the complex logic.
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

  async updatePaymentStatus(
    id: string,
    updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    await this.findOne(id); // Ensure order exists
    return this.orderRepository.updatePaymentStatus(id, updatePaymentStatusDto);
  }
}