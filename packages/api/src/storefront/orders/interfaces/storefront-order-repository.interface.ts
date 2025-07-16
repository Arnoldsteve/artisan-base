import { CreateStorefrontOrderDto } from '../dto/create-storefront-order.dto';
import { GetStorefrontOrdersDto } from '../dto/get-storefront-orders.dto';

export interface IStorefrontOrderRepository {
  create(dto: CreateStorefrontOrderDto): Promise<any>;
  getOrders(query: GetStorefrontOrdersDto): Promise<any>;
  getOrder(id: string, query: GetStorefrontOrdersDto): Promise<any>;
}
