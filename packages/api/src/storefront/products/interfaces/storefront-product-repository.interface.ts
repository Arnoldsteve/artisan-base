import { GetFeaturedProductsDto } from '../dto/get-featured-products';
import { GetProductsDto } from '../dto/get-products.dto';

export interface IStorefrontProductRepository {
  findAll(filters: GetProductsDto, tenantId: string): Promise<any>;
  findOne(id: string): Promise<any>;
  findFeatured(filters: GetFeaturedProductsDto,  tenantId: string): Promise<any>;
  findCategories(tenantId: string): Promise<any>;
}
