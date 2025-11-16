import { GetProductsDto } from '../dto/get-products.dto';
import { GetProductDto } from '../dto/get-product.dto';

export interface IStorefrontProductRepository {
  findAll(filters: GetProductsDto, tenantId: string): Promise<any>;
  findOne(id: string): Promise<any>;
  findFeatured(): Promise<any>;
  findCategories(tenantId: string): Promise<any>;
}
