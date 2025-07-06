import { Controller, Get, Post, Patch, Body, ValidationPipe, Scope, UseGuards, Query, Param, Delete, HttpCode } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'; // <-- IMPORT
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';

// Note: In a real app, you would add a @UseGuards(DashboardAuthGuard) here
// to ensure only logged-in dashboard users can access these routes.

@Controller({
  path: 'dashboard/products',
  scope: Scope.REQUEST, 
})
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body(ValidationPipe) createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query(ValidationPipe) paginationQuery: PaginationQueryDto) {
    return this.productService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }
  

  @Delete(':id')
  @HttpCode(204) 
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}