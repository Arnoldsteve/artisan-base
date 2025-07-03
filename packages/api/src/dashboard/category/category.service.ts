import { Injectable, Scope, Inject } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ICategoryRepository } from './interfaces/category-repository.interface';

@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  findAll(pagination?: PaginationQueryDto) {
    return this.categoryRepository.findAll(pagination);
  }

  findOne(id: string) {
    return this.categoryRepository.findOne(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryRepository.remove(id);
  }
}
