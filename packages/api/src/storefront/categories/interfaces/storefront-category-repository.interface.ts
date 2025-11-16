import { GetCategoriesDto } from '../dto/get-categories.dto';

export interface IStorefrontCategoryRepository {
  findAll(filters: GetCategoriesDto, tenantId:string): Promise<any>;
  findOne(id: string): Promise<any>;
}
