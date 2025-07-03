import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export interface ICategoryRepository {
  create(dto: CreateCategoryDto): Promise<any>;
  findAll(pagination?: PaginationQueryDto): Promise<any>;
  findOne(id: string): Promise<any>;
  update(id: string, dto: UpdateCategoryDto): Promise<any>;
  remove(id: string): Promise<any>;
}

export const ICategoryRepository = Symbol('ICategoryRepository');
