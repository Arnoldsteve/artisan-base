import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export interface IProductRepository {
  create(dto: CreateProductDto): Promise<any>;
  bulkCreate(dtos: CreateProductDto[]): Promise<any>;
  findAll(pagination: PaginationQueryDto): Promise<any>;
  findOne(id: string): Promise<any>;
  update(id: string, dto: UpdateProductDto): Promise<any>;
  remove(id: string): Promise<any>;
}
