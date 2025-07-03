import { CreateManualOrderDto, UpdateOrderDto, UpdatePaymentStatusDto } from '../dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export interface IOrderRepository {
  createManualOrder(dto: CreateManualOrderDto): Promise<any>;
  findAll(pagination: PaginationQueryDto): Promise<any>;
  findOne(id: string): Promise<any>;
  updateStatus(id: string, dto: UpdateOrderDto): Promise<any>;
  updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto): Promise<any>;
} 