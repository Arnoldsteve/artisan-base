import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
  Scope,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProductCategoryService } from './product-category.service';
import { AssignCategoryDto } from './dto/assign-category.dto';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@Controller({
  path: 'dashboard/product-categories',
  scope: Scope.REQUEST,
})
@UseGuards(JwtAuthGuard)
export class ProductCategoryController {
  constructor(private readonly service: ProductCategoryService) {}

  @Post()
  assign(@Body(ValidationPipe) body: AssignCategoryDto) {
    return this.service.assignProductToCategory(
      body.productId,
      body.categoryId,
    );
  }

  @Delete()
  unassign(@Body(ValidationPipe) body: AssignCategoryDto) {
    return this.service.unassignProductFromCategory(
      body.productId,
      body.categoryId,
    );
  }

  @Get('by-product/:productId')
  getCategoriesForProduct(@Param('productId') productId: string) {
    return this.service.getCategoriesForProduct(productId);
  }

@Get('by-category/:categoryId')
getProductsForCategory(
  @Param('categoryId') categoryId: string,
  @Query(ValidationPipe) paginationQuery: PaginationQueryDto,
) {
  return this.service.getProductsForCategory(categoryId, paginationQuery);
}

}
