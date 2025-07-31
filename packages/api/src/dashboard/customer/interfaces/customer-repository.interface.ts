import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export interface ICustomerRepository {
  create(dto: CreateCustomerDto): Promise<any>;
  findAll(pagination: PaginationQueryDto): Promise<any>;
  findOne(id: string): Promise<any>;
  update(id: string, dto: UpdateCustomerDto): Promise<any>;
  remove(id: string): Promise<any>;
}
